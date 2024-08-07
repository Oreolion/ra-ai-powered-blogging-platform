"use client";
import styles from "@/styles/mobiledashboardNav.module.css";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const debouncedValue = useDebounce(search, 300);

  useEffect(() => {
    try {
      if (debouncedValue) {
        // console.log("Client: Debounced search value:", debouncedValue);
        router.push(`/dashboard?search=${debouncedValue}`);
      } else if (!debouncedValue && pathname === "/dashboard") {
        router.push("/dashboard");
        setSearch("");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [debouncedValue, pathname, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // console.log(search);
  };

  return (
    <div className={styles.search_form}>
      <label className={styles.search}>
        <svg
          className={styles.svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </label>
      <input
        className={styles.input}
        type="search"
        placeholder="search and Read Along..."
        value={search}
        onChange={handleChange}
        onLoad={() => setSearch("")}
      />
    </div>
  );
};

export default SearchBar;
