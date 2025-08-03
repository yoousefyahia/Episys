'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load language from localStorage if available
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      // Update document direction and language for saved language
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    } else {
      // Set default language (English) direction
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  }, []);

  const changeLanguage = newLanguage => {
    setLanguage(newLanguage);
    if (isClient) {
      localStorage.setItem('language', newLanguage);
      // Update document direction and language
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const t = key => {
    const translations = {
      ar: {
        // Navbar
        home: 'الرئيسية',
        bookTable: 'حجز طاولة',
        aboutUs: 'من نحن',
        contactUs: 'اتصل بنا',
        callWaiter: 'استدعاء النادل',
        cart: 'السلة',

        // Categories
        allProducts: 'كل المنتجات',
        mainDishes: 'الأطباق الرئيسية',
        coldDrinks: 'مشروبات باردة',
        hotDrinks: 'مشروبات ساخنة',
        pastries: 'مخبوزات',
        desserts: 'حلويات',
        productCategories: 'فئات المنتجات',

        // Search
        searchPlaceholder: 'ابحث عن منتج...',
        noResults: 'لا توجد منتجات تطابق البحث',

        // Product Actions
        addToCart: 'إضافة إلى السلة',
        callWaiterBtn: 'اضغط لاستدعاء النادل !',

        // Product Names
        cappuccino: 'كابتشينو كلاسيك',
        espresso: 'إسبريسو',
        latte: 'لاتيه',
        mocha: 'موكا',
        burger: 'برجر لحم',
        pizza: 'بيتزا مارجريتا',
        orangeJuice: 'عصير برتقال طازج',
        croissant: 'كرواسون',
        cheesecake: 'تشيز كيك',
        chocolateCake: 'كيك شوكولاتة',

        // Time
        minutes: 'دقائق',

        // Currency
        riyal: 'ريال',

        // Locations
        degla: 'دجلة',
        nasrCity: 'مدينة نصر',
        alexandria: 'الإسكندرية',

        // Language
        english: 'English',
        arabic: 'العربية',

        // Footer
        aboutUs: 'معلومات عنا',
        ourBranches: 'فروعنا',
        paymentMethods: 'طرق الدفع',
        contactUs: 'تواصل معنا',
        aboutUsDescription:
          'نحن مطعم رائد في تقديم أفضل الأطباق والخدمات المتميزة. نسعى لتقديم تجربة طعام لا تُنسى لعملائنا الكرام.',
        viewBranchesLink: 'لمعرفة فروعنا اضغط هنا',
        workingHours: 'نعمل يومياً من 9 صباحاً إلى 12 منتصف الليل',
        trackOrderFromHere: 'تتبع الطلب من هنا',
        allRightsReserved: 'جميع الحقوق محفوظة.',
        waiterCalled: 'تم استدعاء النادل!',
        trackOrderClicked: 'تم النقر على تتبع الطلب!',
        cartClicked: 'تم النقر على السلة!',

        // Cart
        cart: 'عربة التسوق',
        cartEmptyMessage: 'العربة فارغة! يرجى إضافة منتجات أولاً.',
        couponCode: 'كود الخصم',
        apply: 'تطبيق',
        subtotal: 'المجموع الفرعي',
        discount: 'الخصم',
        serviceCharge: 'رسوم الخدمة',
        tax: 'الضريبة',
        finalTotal: 'المجموع النهائي',
        proceedToOrder: 'إتمام الطلب',
        cancel: 'إلغاء',
        couponApplied: 'تم تطبيق الكوبون بنجاح!',
        invalidCoupon: 'كوبون غير صحيح!',
        cartEmpty: 'العربة فارغة!',
        orderPlaced: 'تم تقديم الطلب بنجاح!',
        currency: 'ريال',
        
        // Order Type
        orderType: 'نوع الطلب',
        hall: 'صالة',
        takeaway: 'تيك أواي',
        delivery: 'ديلفري',
        selectOrderType: 'اختر نوع الطلب',
        
        // Order Details
        tableNumber: 'رقم الطاولة',
        selectTable: 'اختر رقم الطاولة',
        customerName: 'اسم العميل',
        phoneNumber: 'رقم الهاتف',
        deliveryAddress: 'عنوان التوصيل',
        enterCustomerName: 'أدخل اسم العميل',
        enterPhoneNumber: 'أدخل رقم الهاتف',
        enterDeliveryAddress: 'أدخل عنوان التوصيل',
        orderDetails: 'تفاصيل الطلب',
        hallDetails: 'تفاصيل الصالة',
        takeawayDetails: 'تفاصيل التيك أواي',
        deliveryDetails: 'تفاصيل التوصيل',

        // Cart customization
        availableSizes: 'الأحجام المتاحة',
        orderAddons: 'إضافات الطلب',
        small: 'صغير',
        medium: 'متوسط',
        large: 'كبير',
        extraPulp: 'لب إضافي',
        iceCubes: 'مكعبات ثلج',
        mintLeaves: 'أوراق النعناع',
        free: 'مجاني',
        optionalNotes: 'ملاحظات اختيارية',
        addNotesForDish: 'أضف ملاحظات للطبق...',

        // Hot Drinks Addons
        extraSugar: 'سكر إضافي',
        lessSugar: 'سكر أقل',
        extraMilk: 'حليب إضافي',
        whippedCream: 'كريمة مخفوقة',

        // Cold Drinks Addons
        extraIce: 'ثلج إضافي',
        lessIce: 'ثلج أقل',

        // Main Dishes Addons
        extraCheese: 'جبن إضافي',
        extraSauce: 'صوص إضافي',
        noOnion: 'بدون بصل',
        spicy: 'حار',
        extraMeat: 'لحم إضافي',
        noPickles: 'بدون مخلل',

        // Hot Drinks Addons
        extraHot: 'أكثر سخونة',
        lessHot: 'أقل سخونة',

        // Pastries Addons
        extraButter: 'زبدة إضافية',
        warmUp: 'تسخين',
        extraJam: 'مربى إضافي',
        extraHoney: 'عسل إضافي',
        freshBaked: 'مخبوز طازج',

        // Desserts Addons
        extraCream: 'كريمة إضافية',
        extraChocolate: 'شوكولاتة إضافية',
        lessSweet: 'أقل حلاوة',
        extraNuts: 'مكسرات إضافية',
        extraFruits: 'فواكه إضافية',

        // Book Table translations
        selectBookingDetails: 'اختر تفاصيل الحجز',
        selectDate: 'اختر اليوم',
        selectTime: 'اختر الوقت',
        selectTimeSlot: 'اختر موعد الحجز',
        specialRequest: 'طلب خاص',
        specialRequestPlaceholder: 'اكتب أي طلب خاص أو ملاحظات...',
        confirmBooking: 'تأكيد الحجز',
        bookingInProgress: 'جاري الحجز...',
        bookingSuccess: 'تم الحجز بنجاح!',
        bookingError: 'حدث خطأ في الحجز',
        invalidGuests: 'عدد الضيوف غير صحيح',
        guest: 'ضيف',
        guests: 'ضيوف',
        breakfast: 'الإفطار',
        lunch: 'الغداء',
        dinner: 'العشاء',

        // About Us translations
        welcomeToOurRestaurant: 'مرحباً بكم في مطعمنا',
        whereGreatFoodMeetsGoodVibes:
          'حيث يلتقي الطعام الرائع مع الأجواء الطيبة',
        aboutParagraph1:
          'مرحباً بكم في مطعمنا، حيث يجتمع الطعام الرائع مع الأجواء الطيبة! نحن مطعم محلي مملوك للعائلة نحب جمع الناس معاً حول وجبات لذيذة ولحظات لا تُنسى. سواء كنت هنا لتناول وجبة سريعة، أو عشاء عائلي، أو احتفال، نحن نهتم بجعل وقتك معنا مميزاً.',
        aboutParagraph2:
          'قائمتنا مليئة بأطباق مصنوعة من مكونات طازجة وعالية الجودة لأننا نؤمن أن الطعام يجب أن يكون لذيذ المذاق كما يجعلك تشعر بالراحة. من أطباقنا المميزة إلى العروض الموسمية، هناك دائماً شيء يثير براعم التذوق لديك.',
        aboutParagraph3:
          'لكننا لسنا فقط عن الطعام - نحن عن المجتمع. نحب رؤية الوجوه المألوفة وترحيب بالجديدة. فريقنا مجموعة مرحة وودية مكرسة لخدمتك بابتسامة والتأكد من أن كل زيارة تشعر وكأنك في المنزل.',
        aboutParagraph4:
          'لذا، تعالوا إلى الداخل، اجلسوا، ودعونا نعتني بالباقي. لا يمكننا الانتظار لمشاركة حبنا للطعام معكم!',
        seeYouSoon: 'نراك قريباً!',

        // Contact Us translations
        getInTouch: 'تواصل معنا',
        weAreHereToHelp: 'نحن هنا لمساعدتك',
        ourAddress: 'عنواننا',
        restaurantAddress: 'DEGLA PALM COMPOUND MALL06',
        ourEmail: 'بريدنا الإلكتروني',
        callUs: 'اتصل بنا',
        workingHours: 'ساعات العمل',
        dailyHours: 'نعمل يومياً من 9 صباحاً إلى 12 منتصف الليل',
        website: 'الموقع الإلكتروني',
        weLookForwardToHearingFromYou: 'نتطلع لسماع منكم',

        // Call Waiter translations
        selectYourTable: 'اختر طاولتك',
        chooseTableToCallWaiter: 'اختر رقم طاولتك لاستدعاء النادل',
        selectedTable: 'الطاولة المختارة',
        callingWaiter: 'جاري استدعاء النادل...',
        waiterCalledSuccessfully: 'تم استدعاء النادل بنجاح!',

        // Validation messages
        selectSizeFor: 'يرجى اختيار حجم لـ',
        invalidQuantityFor: 'كمية غير صحيحة لـ',
        invalidTotalPrice: 'السعر الإجمالي غير صحيح',
        notesRequired: 'الملاحظات مطلوبة',
        required: 'مطلوب',

        // Toast messages
        productAddedToCart: 'تم إضافة المنتج بنجاح',
        productRemovedFromCart: 'تم إزالة المنتج من السلة',
        cartUpdated: 'تم تحديث السلة',
        orderPlacedSuccessfully: 'تم تقديم الطلب بنجاح',
        errorOccurred: 'حدث خطأ',
        success: 'نجح',
        error: 'خطأ',

        // Modal
        availableSizes: 'الأحجام المتاحة',
        orderAddons: 'إضافات الطلب',
        specialNotes: 'ملاحظات خاصة',
        addSpecialNotes: 'أضف ملاحظات خاصة للمنتج...',
        total: 'المجموع',
        addToCart: 'إضافة إلى السلة',
        notes: 'الملاحظات',

        // PWA Install Prompt
        installApp: 'ثبت التطبيق',
        installAppDescription: 'احصل على تجربة أفضل مع تطبيق EPISYS المخصص',
        install: 'تثبيت',
        dismiss: 'إغلاق',
      },
      en: {
        // Navbar
        home: 'Home',
        bookTable: 'Book Table',
        aboutUs: 'About Us',
        contactUs: 'Contact Us',
        callWaiter: 'Call Waiter',
        cart: 'Cart',

        // Categories
        allProducts: 'All Products',
        mainDishes: 'Main Dishes',
        coldDrinks: 'Cold Drinks',
        hotDrinks: 'Hot Drinks',
        pastries: 'Pastries',
        desserts: 'Desserts',
        productCategories: 'Product Categories',

        // Search
        searchPlaceholder: 'Search for a product...',
        noResults: 'No products match your search',

        // Product Actions
        addToCart: 'Add to Cart',
        callWaiterBtn: 'Press to call waiter!',

        // Product Names
        cappuccino: 'Classic Cappuccino',
        espresso: 'Espresso',
        latte: 'Latte',
        mocha: 'Mocha',
        burger: 'Beef Burger',
        pizza: 'Margherita Pizza',
        orangeJuice: 'Fresh Orange Juice',
        croissant: 'Croissant',
        cheesecake: 'Cheesecake',
        chocolateCake: 'Chocolate Cake',

        // Time
        minutes: 'minutes',

        // Currency
        riyal: 'SAR',

        // Locations
        degla: 'Degla',
        nasrCity: 'Nasr City',
        alexandria: 'Alexandria',

        // Language
        english: 'English',
        arabic: 'العربية',

        // Footer
        aboutUs: 'About Us',
        ourBranches: 'Our Branches',
        paymentMethods: 'Payment Methods',
        contactUs: 'Contact Us',
        aboutUsDescription:
          'We are a leading restaurant in providing the best dishes and exceptional services. We strive to offer an unforgettable dining experience for our valued customers.',
        viewBranchesLink: 'Click here to view our branches',
        workingHours: 'We operate daily from 9 AM to 12 AM',
        trackOrderFromHere: 'Track Order From Here',
        allRightsReserved: 'All rights reserved.',
        waiterCalled: 'Waiter has been called!',
        trackOrderClicked: 'Track order functionality clicked!',
        cartClicked: 'Cart functionality clicked!',

        // Cart
        cart: 'Cart',
        cartEmptyMessage: 'Cart is empty! Please add products first.',
        couponCode: 'coupon code',
        apply: 'Apply',
        subtotal: 'subtotal',
        discount: 'discount',
        serviceCharge: 'service charge',
        tax: 'tax',
        finalTotal: 'Final Total',
        proceedToOrder: 'Proceed to Order',
        cancel: 'Cancel',
        couponApplied: 'Coupon applied successfully!',
        invalidCoupon: 'Invalid coupon!',
        cartEmpty: 'Cart is empty!',
        orderPlaced: 'Order placed successfully!',
        currency: 'SAR',
        
        // Order Type
        orderType: 'Order Type',
        hall: 'Hall',
        takeaway: 'Takeaway',
        delivery: 'Delivery',
        selectOrderType: 'Select Order Type',
        
        // Order Details
        tableNumber: 'Table Number',
        selectTable: 'Select Table Number',
        customerName: 'Customer Name',
        phoneNumber: 'Phone Number',
        deliveryAddress: 'Delivery Address',
        enterCustomerName: 'Enter customer name',
        enterPhoneNumber: 'Enter phone number',
        enterDeliveryAddress: 'Enter delivery address',
        orderDetails: 'Order Details',
        hallDetails: 'Hall Details',
        takeawayDetails: 'Takeaway Details',
        deliveryDetails: 'Delivery Details',

        // Cart customization
        availableSizes: 'Available Sizes',
        orderAddons: 'Order Add-ons',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        extraPulp: 'Extra Pulp',
        iceCubes: 'Ice Cubes',
        mintLeaves: 'Mint Leaves',
        free: 'Free',
        optionalNotes: 'Optional Notes',
        addNotesForDish: 'Add notes for the dish...',

        // Hot Drinks Addons
        extraSugar: 'Extra Sugar',
        lessSugar: 'Less Sugar',
        extraMilk: 'Extra Milk',
        whippedCream: 'Whipped Cream',

        // Cold Drinks Addons
        extraIce: 'Extra Ice',
        lessIce: 'Less Ice',

        // Main Dishes Addons
        extraCheese: 'Extra Cheese',
        extraSauce: 'Extra Sauce',
        noOnion: 'No Onion',
        spicy: 'Spicy',
        extraMeat: 'Extra Meat',
        noPickles: 'No Pickles',

        // Hot Drinks Addons
        extraHot: 'Extra Hot',
        lessHot: 'Less Hot',

        // Pastries Addons
        extraButter: 'Extra Butter',
        warmUp: 'Warm Up',
        extraJam: 'Extra Jam',
        extraHoney: 'Extra Honey',
        freshBaked: 'Fresh Baked',

        // Desserts Addons
        extraCream: 'Extra Cream',
        extraChocolate: 'Extra Chocolate',
        lessSweet: 'Less Sweet',
        extraNuts: 'Extra Nuts',
        extraFruits: 'Extra Fruits',

        // Book Table translations
        selectBookingDetails: 'Select your booking details',
        selectDate: 'Select Day',
        selectTime: 'Select Time',
        selectTimeSlot: 'Select Time Slot',
        specialRequest: 'Any special request?',
        specialRequestPlaceholder: 'Write any special request or notes...',
        confirmBooking: 'Confirm Booking',
        bookingInProgress: 'Booking in progress...',
        bookingSuccess: 'Booking successful!',
        bookingError: 'Booking error occurred',
        invalidGuests: 'Invalid number of guests',
        guest: 'Guest',
        guests: 'Guests',
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',

        // About Us translations
        welcomeToOurRestaurant: 'Welcome to our restaurant',
        whereGreatFoodMeetsGoodVibes: 'where great food meets good vibes',
        aboutParagraph1:
          "Welcome to our restaurant, where great food and good vibes come together! We're a local, family-owned spot that loves bringing people together over delicious meals and unforgettable moments. Whether you're here for a quick bite, a family dinner, or a celebration, we're all about making your time with us special.",
        aboutParagraph2:
          "Our menu is packed with dishes made from fresh, quality ingredients because we believe food should taste as good as it makes you feel. From our signature dishes to seasonal specials, there's always something to excite your taste buds.",
        aboutParagraph3:
          "But we're not just about the food—we're about community. We love seeing familiar faces and welcoming new ones. Our team is a fun, friendly bunch dedicated to serving you with a smile and making sure every visit feels like coming home.",
        aboutParagraph4:
          "So, come on in, grab a seat, and let us take care of the rest. We can't wait to share our love of food with you!",
        seeYouSoon: 'See you soon!',

        // Contact Us translations
        getInTouch: 'Get in Touch',
        weAreHereToHelp: 'We are here to help',
        ourAddress: 'Our Address',
        restaurantAddress: 'DEGLA PALM COMPOUND MALL06',
        ourEmail: 'Our Email',
        callUs: 'Call Us',
        workingHours: 'Working Hours',
        dailyHours: 'We operate daily from 9 AM to 12 AM',
        website: 'Website',
        weLookForwardToHearingFromYou: 'We look forward to hearing from you',

        // Call Waiter translations
        selectYourTable: 'Select Your Table',
        chooseTableToCallWaiter: 'Choose your table number to call a waiter',
        selectedTable: 'Selected Table',
        callingWaiter: 'Calling Waiter...',
        waiterCalledSuccessfully: 'Waiter called successfully!',

        // Validation messages
        selectSizeFor: 'Please select a size for',
        invalidQuantityFor: 'Invalid quantity for',
        invalidTotalPrice: 'Invalid total price',
        notesRequired: 'Notes are required',
        required: 'required',

        // Toast messages
        productAddedToCart: 'added successfully',
        productRemovedFromCart: 'removed from cart',
        cartUpdated: 'Cart updated',
        orderPlacedSuccessfully: 'Order placed successfully',
        errorOccurred: 'An error occurred',
        success: 'Success',
        error: 'Error',

        // Modal
        availableSizes: 'Available Sizes',
        orderAddons: 'Order Add-ons',
        specialNotes: 'Special Notes',
        addSpecialNotes: 'Add special notes for the product...',
        total: 'Total',
        addToCart: 'Add to Cart',
        notes: 'Notes',

        // PWA Install Prompt
        installApp: 'Install App',
        installAppDescription: 'Get a better experience with the dedicated EPISYS app',
        install: 'Install',
        dismiss: 'Dismiss',
      },
    };

    return translations[language]?.[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isClient,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
