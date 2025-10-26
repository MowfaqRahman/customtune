"use client";

import Link from "next/link";
import { Home, Package, Users, ShoppingBag, DollarSign, Share2, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from '../../lib/supabaseClient';

export default function AdminNavigation() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-white shadow-lg w-64 flex-col fixed inset-y-0">
      <div className="flex items-center justify-center h-16 border-b">
        <Image
          src="/assets/hardtunelogo.png"
          alt="Duka Logo"
          width={100}
          height={40}
          priority
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-2">
          <NavLink href="/admin" icon={Home}>Home</NavLink>
          <NavLink href="/admin/orders" icon={ShoppingBag}>Customer Orders</NavLink>
          <NavLink href="/admin/customers" icon={Users}>All Customers</NavLink>
          <DropdownNavLink icon={Package} title="Products">
            <NavLink href="/admin/products" nested>All Products</NavLink>
            <NavLink href="/admin/products/new" nested>Add New</NavLink>
          </DropdownNavLink>
          <DropdownNavLink icon={ShoppingBag} title="Shop">
            <NavLink href="/admin/shop" nested>Shop Settings</NavLink>
            <NavLink href="/admin/shop/coupons" nested>Coupons</NavLink>
          </DropdownNavLink>
          <DropdownNavLink icon={DollarSign} title="Income">
            <NavLink href="/admin/income" nested>Overview</NavLink>
            <NavLink href="/admin/income/reports" nested>Reports</NavLink>
          </DropdownNavLink>
          <DropdownNavLink icon={Share2} title="Promote">
            <NavLink href="/admin/promote" nested>Campaigns</NavLink>
            <NavLink href="/admin/promote/new" nested>New Campaign</NavLink>
          </DropdownNavLink>
        </nav>
      </div>
      <div className="px-2 py-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  icon?: React.ElementType; // Changed from any to React.ElementType
  children: React.ReactNode;
  nested?: boolean;
}

function NavLink({ href, icon: Icon, children, nested }: NavLinkProps) {
  return (
    <Link href={href} className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${nested ? "pl-8" : ""}`}>
      {Icon && <Icon className="mr-3 h-5 w-5" />}
      <span>{children}</span>
    </Link>
  );
}

interface DropdownNavLinkProps {
  icon: React.ElementType; // Changed from any to React.ElementType
  title: string;
  children: React.ReactNode;
}

function DropdownNavLink({ icon: Icon, title, children }: DropdownNavLinkProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none"
      >
        <span className="flex items-center">
          <Icon className="mr-3 h-5 w-5" />
          {title}
        </span>
        <ChevronDown className={`h-4 w-4 transform ${isOpen ? "rotate-180" : ""} transition-transform`} />
      </button>
      {isOpen && <div className="ml-4 border-l border-gray-200 pl-2 space-y-1">{children}</div>}
    </div>
  );
}
