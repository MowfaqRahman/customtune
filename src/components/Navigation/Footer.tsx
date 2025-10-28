import React from "react";

export const Footer = (): JSX.Element => {
  return (
    <footer className="px-4 py-8 md:px-[100px] md:py-16 border-t">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-sm">
        <div>
          <div className="text-2xl font-semibold mb-3">HARDTUNE</div>
          <p className="text-muted-foreground">
            The advantage of having a workspace with us is that you get
            comfortable service and all-around facilities.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Services</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Email Marketing</li>
            <li>Campaigns</li>
            <li>Branding</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Catalog</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Wheels</li>
            <li>Tires</li>
            <li>Suspension</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Follow Us</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
        <span>Copyright © 2025</span>
        <div className="flex gap-4 md:gap-6">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};
