"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/lib/useDebounce"

const SearchBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const debouncedValue = useDebounce(search, 300)

  useEffect(() => {
    if (debouncedValue) {
      const params = new URLSearchParams(searchParams)
      params.set("search", debouncedValue)
      router.push(`${pathname}?${params.toString()}`)
    } else if (!debouncedValue && pathname === "/dashboard") {
      router.push("/dashboard")
    }
  }, [debouncedValue, pathname, router, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div className="relative flex md:top-[9rem] md:left-[10rem] sm:max-w-[15rem] md:max-w-[45rem] z-10 items-center bg-slate-800/50 border border-slate-600 rounded-xl overflow-hidden">
      <label className="flex items-center pl-4">
        <svg className="w-5 h-5 fill-current text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </label>
      <input
        className="flex-1 px-4 py-3 bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none"
        type="search"
        placeholder="search and Read Along..."
        value={search}
        onChange={handleChange}
      />
    </div>
  )
}

export default SearchBar
