import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ar: {
    translation: {
      appName: "داروكنكت", tagline: "منصة العقارات الجزائرية الأولى",
      searchPlaceholder: "ابحث عن عقار...", allTypes: "كل الأنواع", allStatus: "كل الحالات",
      allWilayas: "كل الولايات", villa: "فيلا", apartment: "شقة", studio: "استوديو",
      forSale: "للبيع", forRent: "للكراء", viewMore: "عرض المزيد", requestVisit: "طلب زيارة",
      myVisits: "زياراتي", properties: "العقارات", logout: "خروج", login: "تسجيل الدخول",
      signup: "إنشاء حساب", welcome: "مرحباً بعودتك", createAccount: "أنشئ حسابك",
      email: "البريد الإلكتروني", password: "كلمة المرور", fullName: "الاسم الكامل",
      start: "ابدأ الآن", learnMore: "اعرف أكثر", verified: "موثق",
      uploadId: "تحميل بطاقة الهوية", ownerInfo: "معلومات المالك",
      showOwner: "عرض معلومات المالك", idRequired: "لعرض معلومات المالك، يرجى تحميل بطاقة الهوية أولاً",
      visitDate: "تاريخ الزيارة", visitTime: "الوقت", confirmVisit: "تأكيد الزيارة",
      cancel: "إلغاء", pending: "قيد الانتظار", approved: "مقبول", rejected: "مرفوض",
      addProperty: "إضافة عقار", overview: "نظرة عامة", adminPanel: "لوحة الإدارة",
      totalProperties: "إجمالي العقارات", visitRequests: "طلبات الزيارة", pendingReq: "قيد الانتظار",
      acceptedReq: "مقبولة", accept: "قبول", reject: "رفض", addNew: "إضافة عقار جديد",
      propTitle: "عنوان العقار", propType: "النوع", propStatus: "الحالة", propWilaya: "الولاية",
      propPrice: "السعر (DA)", propRooms: "عدد الغرف", propArea: "المساحة (م²)",
      propDesc: "الوصف", propImages: "صور العقار", addImages: "إضافة صور",
      ownerDocs: "وثائق الملكية", chooseFile: "اختر ملف",
      visitIdRequired: "يجب تحميل بطاقة الهوية قبل طلب الزيارة",
      noVisits: "لا توجد زيارات بعد", latVisits: "آخر الطلبات", rooms: "غرف",
      description: "الوصف", location: "الموقع", hi: "أهلاً",
      uploadImages: "تحميل الصور من المكتبة", imagesSelected: "صور محددة",
      uploading: "جاري الرفع...", visitSent: "تم إرسال طلب الزيارة!", deleteConfirm: "حذف العقار؟",
      lang: "EN",
      wilayas: {
        "1": "أدرار", "2": "الشلف", "3": "الأغواط", "4": "أم البواقي", "5": "باتنة", "6": "بجاية", "7": "بسكرة", "8": "بشار",
        "9": "البليدة", "10": "البويرة", "11": "تمنراست", "12": "تبسة", "13": "تلمسان", "14": "تيارت", "15": "تيزي وزو", "16": "الجزائر",
        "17": "الجلفة", "18": "جيجل", "19": "سطيف", "20": "سعيدة", "21": "سكيكدة", "22": "سيدي بلعباس", "23": "عنابة", "24": "قالمة",
        "25": "قسنطينة", "26": "المدية", "27": "مستغانم", "28": "المسيلة", "29": "معسكر", "30": "ورقلة", "31": "وهران", "32": "البيض",
        "33": "إليزي", "34": "برج بوعريريج", "35": "بومرداس", "36": "الطارف", "37": "تندوف", "38": "تيسمسيلت", "39": "الوادي", "40": "خنشلة",
        "41": "سوق أهراس", "42": "تيبازة", "43": "ميلة", "44": "عين الدفلى", "45": "النعامة", "46": "عين تموشنت", "47": "غرداية", "48": "غليزان"
      }
    }
  },
  en: {
    translation: {
      appName: "DarConnect", tagline: "Algeria's #1 Real Estate Platform",
      searchPlaceholder: "Search properties...", allTypes: "All Types", allStatus: "All Status",
      allWilayas: "All Wilayas", villa: "Villa", apartment: "Apartment", studio: "Studio",
      forSale: "For Sale", forRent: "For Rent", viewMore: "View More", requestVisit: "Request Visit",
      myVisits: "My Visits", properties: "Properties", logout: "Logout", login: "Login",
      signup: "Sign Up", welcome: "Welcome back", createAccount: "Create your account",
      email: "Email", password: "Password", fullName: "Full Name",
      start: "Get Started", learnMore: "Learn More", verified: "Verified",
      uploadId: "Upload ID Card", ownerInfo: "Owner Information",
      showOwner: "View Owner Info", idRequired: "Please upload your ID card to view owner information",
      visitDate: "Visit Date", visitTime: "Time", confirmVisit: "Confirm Visit",
      cancel: "Cancel", pending: "Pending", approved: "Approved", rejected: "Rejected",
      addProperty: "Add Property", overview: "Overview", adminPanel: "Admin Panel",
      totalProperties: "Total Properties", visitRequests: "Visit Requests", pendingReq: "Pending",
      acceptedReq: "Accepted", accept: "Accept", reject: "Reject", addNew: "Add New Property",
      propTitle: "Property Title", propType: "Type", propStatus: "Status", propWilaya: "Wilaya",
      propPrice: "Price (DA)", propRooms: "Rooms", propArea: "Area (m²)",
      propDesc: "Description", propImages: "Property Images", addImages: "Add Images",
      ownerDocs: "Ownership Documents", chooseFile: "Choose File",
      visitIdRequired: "You must upload your ID card before requesting a visit",
      noVisits: "No visits yet", latVisits: "Recent Requests", rooms: "rooms",
      description: "Description", location: "Location", hi: "Hi",
      uploadImages: "Upload Images from Library", imagesSelected: "images selected",
      uploading: "Uploading...", visitSent: "Visit request sent!", deleteConfirm: "Delete property?",
      lang: "ع",
      wilayas: {
        "1": "Adrar", "2": "Chlef", "3": "Laghouat", "4": "Oum El Bouaghi", "5": "Batna", "6": "Béjaïa", "7": "Biskra", "8": "Béchar",
        "9": "Blida", "10": "Bouira", "11": "Tamanrasset", "12": "Tébessa", "13": "Tlemcen", "14": "Tiaret", "15": "Tizi Ouzou", "16": "Alger",
        "17": "Djelfa", "18": "Jijel", "19": "Sétif", "20": "Saïda", "21": "Skikda", "22": "Sidi Bel Abbès", "23": "Annaba", "24": "Guelma",
        "25": "Constantine", "26": "Médéa", "27": "Mostaganem", "28": "M'Sila", "29": "Mascara", "30": "Ouargla", "31": "Oran", "32": "El Bayadh",
        "33": "Illizi", "34": "Bordj Bou Arréridj", "35": "Boumerdès", "36": "El Tarf", "37": "Tindouf", "38": "Tissemsilt", "39": "El Oued", "40": "Khenchela",
        "41": "Souk Ahras", "42": "Tipaza", "43": "Mila", "44": "Aïn Defla", "45": "Naâma", "46": "Aïn Témouchent", "47": "Ghardaïa", "48": "Relizane"
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    interpolation: { escapeValue: false }
  })

export default i18n
