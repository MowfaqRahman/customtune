import { SearchIcon, ShoppingCartIcon, ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { UserProfileDropdown } from "./UserProfileDropdown";
import Image from "next/image";

const navigationItems = [
  { label: "Shop", hasDropdown: true, dropdownItems: [
    { label: "All Products", href: "/products" },
    { label: "Category 1", href: "/products?category=1" },
    { label: "Category 2", href: "/products?category=2" },
  ] },
  { label: "On Sale", hasDropdown: false, href: "/sale" },
  { label: "New Arrivals", hasDropdown: false, href: "/new-arrivals" },
  { label: "Brands", hasDropdown: false, href: "/brands" },
];

export const NavigationBar = () => {
  const { getTotalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <nav className="flex items-center justify-between px-[100px] py-8">
      <div className="flex items-center gap-12">
        <Link href="/">
          <Image
            src="/assets/hardtunelogo.png"
            alt="HARDTUNE"
            className="h-[110px] w-auto object-contain"
            width={110} // Approximate height based on h-[110px]
            height={110} // Approximate height based on h-[110px]
          />
      </Link>

        <div className="flex items-center gap-6">
          {navigationItems.map((item, index) => (
            <div key={index} className="relative flex items-center gap-1">
              <span
                className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] cursor-pointer"
                onClick={() => item.hasDropdown && setIsShopDropdownOpen(!isShopDropdownOpen)}
              >
                {item.label}
              </span>
              {item.hasDropdown && (
                <ChevronDownIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                />
              )}
              {item.hasDropdown && isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                  {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                    <Link key={dropdownIndex} href={dropdownItem.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 px-4 py-3 bg-[#efefef] rounded-[62px] w-[450px]">
          <SearchIcon className="w-6 h-6 text-[#00000066]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="[font-family:'Satoshi-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] flex-1 bg-transparent outline-none"
          />
          <button type="submit" className="[font-family:'Inder',Helvetica] font-normal text-[#00000066] text-base tracking-[0] leading-[normal]">
            All ▾
          </button>
        </form>

        <Link href="/cart" className="relative">
          <ShoppingCartIcon className="w-6 h-6 cursor-pointer" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {getTotalItems()}
            </span>
          )}
        </Link>
        <UserProfileDropdown />
      </div>
    </nav>
  );
};
