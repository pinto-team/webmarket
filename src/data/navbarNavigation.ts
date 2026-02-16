import categoriesMegaMenu from "./categoriesMegaMenu";
import { MegaMenuItem, Menu } from "models/Navigation.model";

// MEGA-MENU DATA
const megaMenus: MegaMenuItem[][] = [
  [
    {
      title: "خانه",
      child: []
    }
  ],

  [
    {
      title: "حساب کاربری",
      child: [
        { title: "لیست سفارشات", url: "/orders" },
        { title: "جزئیات سفارش", url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8" },
        { title: "مشاهده پروفایل", url: "/profile" },
        { title: "ویرایش پروفایل", url: "/profile/e42e28ea-528f-4bc8-81fb-97f658d67d75" },
        { title: "لیست آدرس‌ها", url: "/address" },
        { title: "افزودن آدرس", url: "/address/d27d0e28-c35e-4085-af1e-f9f1b1bd9c34" },
        { title: "همه تیکت‌ها", url: "/support-tickets" },
        { title: "جزئیات تیکت", url: "/support-tickets/when-will-my-product-arrive" },
        { title: "علاقه‌مندی‌ها", url: "/wish-list" }
      ]
    }
  ],

  [
    {
      title: "حساب فروشنده",
      child: [
        { title: "داشبورد", url: "/vendor/dashboard" },
        { title: "پروفایل", url: "/vendor/account-settings" }
      ]
    },
    {
      title: "محصولات",
      child: [
        { title: "همه محصولات", url: "/admin/products" },
        { title: "افزودن/ویرایش محصول", url: "/admin/products/create" }
      ]
    },
    {
      title: "سفارشات",
      child: [
        { title: "همه سفارشات", url: "/admin/orders" },
        { title: "جزئیات سفارش", url: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8" }
      ]
    },
    {
      title: "احراز هویت",
      child: [
        { title: "ورود", url: "/login" },
        { title: "ثبت نام", url: "/register" }
      ]
    }
  ],

  [
    {
      title: "صفحه فروش",
      child: [
        { title: "نسخه 1", url: "/sales-1" },
        { title: "نسخه 2", url: "/sales-2" }
      ]
    },
    {
      title: "فروشگاه",
      child: [
        { title: "جستجوی محصول", url: "/products/search?category=clothes" },
        { title: "محصول", url: "/products/lord-2019" },
        { title: "سبد خرید", url: "/cart" },
        { title: "تسویه حساب", url: "/checkout" },
        { title: "تسویه جایگزین", url: "/checkout-alternative" },
        { title: "تایید سفارش", url: "/order-confirmation" }
      ]
    }
  ]
];

// MAIN NAVIGATION DATA
const navbarNavigation: Menu[] = [
  {
    title: "خانه",
    megaMenu: false,
    megaMenuWithSub: false,
    child: []
  },

  {
    megaMenu: true,
    megaMenuWithSub: false,
    title: "منوی کامل",
    child: megaMenus
  },
  {
    megaMenu: false,
    megaMenuWithSub: true,
    title: "منوی تمام صفحه",
    child: categoriesMegaMenu
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "صفحات",
    child: [
      {
        title: "صفحه فروش",
        child: [
          { title: "نسخه 1", url: "/sales-1" },
          { title: "نسخه 2", url: "/sales-2" }
        ]
      },
      {
        title: "فروشنده",
        child: [
          { title: "همه فروشندگان", url: "/shops" },
          { title: "فروشگاه فروشنده", url: "/shops/scarlett-beauty" }
        ]
      },
      {
        title: "فروشگاه",
        child: [
          { title: "جستجوی محصول", url: "/products/search?category=clothes" },
          { title: "محصول", url: "/products/lord-2019" },
          { title: "سبد خرید", url: "/cart" },
          { title: "تسویه حساب", url: "/checkout" },
          { title: "تسویه جایگزین", url: "/checkout-alternative" },
          { title: "تایید سفارش", url: "/order-confirmation" }
        ]
      },
      {
        title: "احراز هویت",
        child: [
          { title: "ورود", url: "/login" },
          { title: "ثبت نام", url: "/register" }
        ]
      }
    ]
  },

  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "حساب کاربری",
    child: [
      {
        title: "سفارشات",
        child: [
          { title: "لیست سفارشات", url: "/orders" },
          { title: "جزئیات سفارش", url: "/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8" }
        ]
      },
      {
        title: "پروفایل",
        child: [
          { title: "مشاهده پروفایل", url: "/profile" },
          { title: "ویرایش پروفایل", url: "/profile/e42e28ea-528f-4bc8-81fb-97f658d67d75" }
        ]
      },
      {
        title: "آدرس",
        child: [
          { title: "لیست آدرس‌ها", url: "/address" },
          { title: "افزودن آدرس", url: "/address/d27d0e28-c35e-4085-af1e-f9f1b1bd9c34" }
        ]
      },
      {
        title: "تیکت‌های پشتیبانی",
        child: [
          { title: "همه تیکت‌ها", url: "/support-tickets" },
          { title: "جزئیات تیکت", url: "/support-tickets/when-will-my-product-arrive" }
        ]
      },
      { title: "علاقه‌مندی‌ها", url: "/wish-list" }
    ]
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "حساب فروشنده",
    child: [
      { title: "داشبورد", url: "/vendor/dashboard" },
      {
        title: "محصولات",
        child: [
          { title: "همه محصولات", url: "/admin/products" },
          { title: "افزودن/ویرایش محصول", url: "/admin/products/lord-2019" }
        ]
      },
      {
        title: "سفارشات",
        child: [
          { title: "همه سفارشات", url: "/admin/orders" },
          { title: "جزئیات سفارش", url: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8" }
        ]
      },
      { title: "پروفایل", url: "/vendor/account-settings" }
    ]
  }
];

export default navbarNavigation;
