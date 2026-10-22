"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { getFirstImage } from "@/lib/images";

// --- Константи ---
export const CART_ITEMS_KEY = "cart-items";

export const API_KEY = process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY;

const NAME_REGEX = /^[A-Za-zА-Яа-яЇїІіЄєҐґ'’\-]{2,}$/;

export const INITIAL_FORM_DATA = {
  lastName: "",
  firstName: "",
  middleName: "",
  phone: "+380",
};

export const INITIAL_UKR_DATA = {
  postIndex: "",
  region: "",
  city: "",
  street: "",
  house: "",
  apartment: "",
};

function getCategoryPath(category) {
  const names = [];

  for (let current = category; current; current = current.parent) {
    if (typeof current.name === "string" && current.name.trim()) {
      names.unshift(current.name);
    }
  }

  return names.join(" / ");
}

// --- Нормалізація товару з localStorage ---
export const normalizeCartItem = (item) => {
  const characteristics = [
    ["Category", getCategoryPath(item.category)],
    ["Color", item.colourGroupName],
    ["Pattern", item.graphicalAppearanceName],
  ].filter(([, value]) => typeof value === "string" && value.trim());

  return {
    id: item.id,
    name: item.title || item.name || "Item",
    image: getFirstImage(item.images?.length ? item.images : item.image),
    price: Number(item.price || 0),
    characteristics,
  };
};

// --- Хук: завантаження товарів з localStorage ---
export const useCartItems = () => {
  const [rawItems, setRawItems] = useState([]);

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || "[]");
        setRawItems(Array.isArray(stored) ? stored : []);
      } catch (err) {
        console.error("Не вдалося завантажити товари з кошика:", err);
        setRawItems([]);
      }
    };

    loadCartItems();

    window.addEventListener("storage", loadCartItems);
    window.addEventListener("cart-updated", loadCartItems);

    return () => {
      window.removeEventListener("storage", loadCartItems);
      window.removeEventListener("cart-updated", loadCartItems);
    };
  }, []);

  const items = useMemo(() => rawItems.map(normalizeCartItem), [rawItems]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items],
  );

  return { items, subtotal };
};

// --- Валідація ---
const validateName = (value, fieldLabel) => {
  const trimmed = value.trim();
  if (!trimmed) return `${fieldLabel} is required`;
  if (trimmed.length < 2) return `${fieldLabel} must be at least 2 characters`;
  if (!NAME_REGEX.test(trimmed))
    return `${fieldLabel} may only contain letters, hyphens, or apostrophes`;
  return "";
};

const validatePhone = (value) => {
  if (!value || value === "+380") return "Phone number is required";
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length !== 12) return "Phone number must have 10 digits after +380";
  if (!value.startsWith("+380")) return "Phone number must start with +380";
  return "";
};

const validateRequired = (value, fieldLabel) => {
  if (!value || !value.trim()) return `${fieldLabel} is required`;
  return "";
};

const validateIndex = (value) => {
  if (!value || !value.trim()) return "Postal code is required";
  if (!/^\d{5}$/.test(value.trim())) return "Postal code must consist of 5 digits";
  return "";
};

export const validateCheckout = ({
  formData,
  carrier,
  selectedNpCity,
  selectedNpBranch,
  ukrData,
}) => {
  const base = {
    lastName: validateName(formData.lastName, "Last name"),
    firstName: validateName(formData.firstName, "First name"),
    middleName: validateName(formData.middleName, "Middle name"),
    phone: validatePhone(formData.phone),
  };

  if (carrier === "nova") {
    return {
      ...base,
      npCity: validateRequired(selectedNpCity?.name || "", "City"),
      npBranch: validateRequired(selectedNpBranch?.name || "", "Branch"),
    };
  }

  return {
    ...base,
    ukrIndex: validateIndex(ukrData.postIndex),
    ukrRegion: validateRequired(ukrData.region, "Region"),
    ukrCity: validateRequired(ukrData.city, "City"),
    ukrStreet: validateRequired(ukrData.street, "Street"),
    ukrHouse: validateRequired(ukrData.house, "House number"),
  };
};

// --- Хук: клік поза елементом + Escape ---
export const useClickOutside = (ref, onOutside) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onOutside();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [ref, onOutside]);
};

// --- Хук: Нова Пошта ---
export const useNovaPoshta = (enabled) => {
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCityLoading, setIsCityLoading] = useState(false);

  const [branchQuery, setBranchQuery] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isBranchLoading, setIsBranchLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (!cityQuery || cityQuery.trim().length < 2) {
      setCities([]);
      return;
    }
    if (selectedCity && cityQuery === selectedCity.name) return;

    const controller = new AbortController();
    setIsCityLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            apiKey: API_KEY,
            modelName: "Address",
            calledMethod: "searchSettlements",
            methodProperties: { CityName: cityQuery.trim(), Limit: "20" },
          }),
        });
        const data = await res.json();
        setCities(
          data.success && data.data?.[0]?.Addresses
            ? data.data[0].Addresses.filter((i) => i.Present && i.Ref)
            : [],
        );
      } catch (err) {
        if (err.name !== "AbortError") setCities([]);
      } finally {
        setIsCityLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cityQuery, enabled, selectedCity]);

  useEffect(() => {
    if (!enabled || !selectedCity?.ref) {
      setBranches([]);
      return;
    }

    const controller = new AbortController();
    setIsBranchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            apiKey: API_KEY,
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: {
              SettlementRef: selectedCity.ref,
              FindByString: branchQuery.trim(),
              Limit: "50",
              Page: "1",
            },
          }),
        });
        const data = await res.json();
        setBranches(data.success && Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (err.name !== "AbortError") setBranches([]);
      } finally {
        setIsBranchLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedCity, branchQuery, enabled]);

  const selectCity = (item) => {
    setSelectedCity({ ref: item.Ref, name: item.Present });
    setCityQuery(item.Present);
    setCities([]);
    setSelectedBranch(null);
    setBranchQuery("");
    setBranches([]);
  };

  const selectBranch = (item) => {
    setSelectedBranch({ ref: item.Ref, name: item.Description });
    setBranchQuery(item.Description);
    setBranches([]);
  };

  const clearCity = () => {
    setSelectedCity(null);
    setCityQuery("");
    setCities([]);
    setSelectedBranch(null);
    setBranchQuery("");
    setBranches([]);
  };

  const clearBranch = () => {
    setSelectedBranch(null);
    setBranchQuery("");
    setBranches([]);
  };

  return {
    cityQuery,
    setCityQuery,
    cities,
    selectedCity,
    isCityLoading,
    branchQuery,
    setBranchQuery,
    branches,
    selectedBranch,
    isBranchLoading,
    selectCity,
    selectBranch,
    clearCity,
    clearBranch,
    reset: clearCity,
  };
};

// --- Хук: вся форма checkout ---
export const useCheckoutForm = (cartItems = []) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [carrier, setCarrier] = useState("nova");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [ukrData, setUkrData] = useState(INITIAL_UKR_DATA);

  const np = useNovaPoshta(carrier === "nova");

  const errors = useMemo(
    () =>
      validateCheckout({
        formData,
        carrier,
        selectedNpCity: np.selectedCity,
        selectedNpBranch: np.selectedBranch,
        ukrData,
      }),
    [formData, carrier, np.selectedCity, np.selectedBranch, ukrData],
  );

  const hasErrors = Object.values(errors).some((e) => e !== "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      let digits = value.replace(/\D/g, "");
      if (!digits.startsWith("380")) digits = "380" + digits;
      digits = digits.slice(0, 12);
      setFormData((p) => ({ ...p, phone: "+" + digits }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUkrChange = (e) => {
    const { name, value } = e.target;
    setUkrData((p) => ({ ...p, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  };

  const handleCarrierChange = (c) => {
    setCarrier(c);
    setTouched({});
    np.reset();
  };

  const touchAll = () => {
    setTouched({
      lastName: true,
      firstName: true,
      middleName: true,
      phone: true,
      ...(carrier === "nova"
        ? { npCity: true, npBranch: true }
        : {
            ukrIndex: true,
            ukrRegion: true,
            ukrCity: true,
            ukrStreet: true,
            ukrHouse: true,
          }),
    });
  };

  const submit = async (total) => {
    setIsSubmitting(true);
    try {
      const deliveryDetails =
        carrier === "nova"
          ? {
              carrierName: "Нова пошта",
              city: np.selectedCity?.name,
              cityRef: np.selectedCity?.ref,
              branch: np.selectedBranch?.name,
              branchRef: np.selectedBranch?.ref,
            }
          : { carrierName: "Укрпошта", ...ukrData };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          carrier,
          deliveryDetails,
          paymentMethod,
          cart: cartItems,
          total,
        }),
      });
      return await res.json();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleInputChange,
    handleBlur,
    ukrData,
    handleUkrChange,
    carrier,
    handleCarrierChange,
    paymentMethod,
    setPaymentMethod,
    errors,
    hasErrors,
    touched,
    touchAll,
    isSubmitting,
    np,
    submit,
  };
};

// --- Хелпер: підсвічування збігу ---
export const highlightMatch = (text, query, highlightClass) => {
  if (!query || !text) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className={highlightClass}>{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  );
};
