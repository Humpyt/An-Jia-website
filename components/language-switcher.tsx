"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, Globe } from "lucide-react"
import { addCustomTranslations } from "./language-translations"

type Language = {
  code: string
  name: string
  nativeName: string
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
  },
]

// Create a context for language translation
type LanguageContextType = {
  currentLanguage: Language;
  translate: (key: string) => string;
  changeLanguage: (lang: Language) => void;
};

const defaultTranslations = {
  en: {
    "featured_properties": "Featured Properties",
    "discover_premium": "Discover our selection of premium properties in Kampala",
    "view_all_properties": "View All Properties",
    "properties": "Properties",
    "neighborhoods": "Neighborhoods",
    "about": "About",
    "contact": "Contact",
    "home": "Home",
    "sign_in": "Sign In",
    "sign_up": "Sign Up",
    "list_property": "List your property",
    "back_to_properties": "Back to Properties",
    "contact_agent": "Contact Agent",
    "save_property": "Save Property",
    "saved": "Saved",
    "beds": "beds",
    "bed": "bed",
    "baths": "baths",
    "bath": "bath",
    "description": "Description",
    "property_summary": "Property Summary",
    "amenities": "Amenities",
    "find_your_perfect_home": "Find Your Perfect Home in Kampala",
    "discover_best_properties": "Discover the best properties in Kampala's most desirable neighborhoods. Whether you're looking to rent or buy, we have the perfect place for you.",
    "become_host": "Become an An Jia You Xuan Host",
    "list_your_property": "List your property on An Jia You Xuan and reach thousands of potential tenants looking for their next home in Kampala.",
    "free_listing_creation": "Free listing creation",
    "powerful_property_management_dashboard": "Powerful property management dashboard",
    "direct_connection_with_potential_tenants": "Direct connection with potential tenants",
    "start_hosting": "Start Hosting",

    // About page translations
    "about_hero_title": "Connecting Kampala's Renters with Their Perfect Home",
    "about_hero_description": "An Jia You Xuan is an Airbnb-inspired rental platform focused exclusively on Kampala's housing market, where property owners can list available units and potential tenants can find their ideal home.",
    "browse_properties": "Browse Properties",
    "explore_neighborhoods": "Explore Neighborhoods",
    "our_mission": "Our Mission",
    "mission_description_1": "An Jia You Xuan was founded with a simple mission: to make finding and renting properties in Kampala simple, transparent, and enjoyable. We believe that everyone deserves a place they can call home, and we're committed to connecting renters with their perfect match.",
    "mission_description_2": "Our platform brings together property owners, agents, and tenants in one place, creating a vibrant marketplace that serves the unique needs of Kampala's housing market.",
    "trusted_by_many": "Trusted by hundreds of property owners and tenants",
    "who_we_serve": "Who We Serve",
    "who_we_serve_description": "An Jia You Xuan is designed to meet the needs of everyone involved in Kampala's rental market.",
    "property_seekers": "Property Seekers",
    "property_seekers_description": "Individuals and families looking for their next home in Kampala",
    "easy_search": "Easy search with advanced filters",
    "detailed_property_info": "Detailed property information",
    "neighborhood_guides": "Neighborhood guides",
    "direct_contact": "Direct contact with owners/agents",
    "property_owners": "Property Owners",
    "property_owners_description": "Individuals who own residential properties in Kampala",
    "free_listings": "Free basic listings",
    "property_management": "Property management dashboard",
    "inquiry_management": "Inquiry management",
    "performance_analytics": "Performance analytics",
    "real_estate_agencies": "Real Estate Agencies",
    "agencies_description": "Professional agencies managing multiple properties",
    "bulk_uploads": "Bulk property uploads",
    "team_management": "Team management",
    "advanced_analytics": "Advanced analytics",
    "agency_profile": "Agency profile page",
    "key_features": "Key Features",
    "key_features_description": "An Jia You Xuan offers a comprehensive set of features designed to make property rental in Kampala seamless and efficient.",
    "advanced_search": "Advanced Search & Filters",
    "advanced_search_description": "Find exactly what you're looking for with our powerful search tools. Filter by location, price, bedrooms, amenities, and more.",
    "neighborhood_guides_feature": "Neighborhood Guides",
    "neighborhood_guides_description": "Detailed information about Kampala's neighborhoods to help you make informed decisions about where to live.",
    "maps_integration": "Google Maps Integration",
    "maps_integration_description": "See exactly where properties are located and explore the surrounding area with integrated maps.",
    "currency_flexibility": "Currency Flexibility",
    "currency_flexibility_description": "Toggle between UGX and USD to view prices in your preferred currency.",
    "verified_listings": "Verified Listings",
    "verified_listings_description": "All properties undergo a verification process to ensure accuracy and reliability of information.",
    "rich_property_details": "Rich Property Details",
    "rich_property_details_description": "Comprehensive information about each property, including high-quality photos, amenities, and detailed descriptions.",
    "direct_contact_feature": "Direct Contact",
    "direct_contact_description": "Connect directly with property owners or agents through WhatsApp or phone calls for quick responses.",
    "owner_dashboard": "Owner Dashboard",
    "owner_dashboard_description": "Property owners get access to a powerful dashboard to manage listings and track performance.",
    "ready_to_find_home": "Ready to Find Your Perfect Home?",
    "join_today": "Join An Jia You Xuan today and discover the best rental properties Kampala has to offer.",

    // Neighborhoods page translations
    "discover_neighborhoods": "Discover Kampala's Neighborhoods",
    "neighborhoods_description": "Explore the diverse neighborhoods of Kampala and find the perfect area for your next home.",
    "properties_available": "Properties Available",
    "avg_price": "Avg. Price",
    "view_properties": "View Properties",
    "learn_more": "Learn More",
    "naguru_description": "Beautiful views with a growing expat community",
    "kololo_description": "Upscale residential area with embassies and luxury homes",
    "bukoto_description": "Vibrant area popular among young professionals",
    "bugolobi_description": "Peaceful residential area with excellent amenities",
    "ntinda_description": "Family-friendly neighborhood with convenient shopping",
    "mutungo_description": "Known as 'Tank Hill' with panoramic lake views",

    // Properties page translations
    "all_properties": "All Properties",
    "filter_properties": "Filter Properties",
    "price_range": "Price Range",
    "min_price": "Min Price",
    "max_price": "Max Price",
    "bedrooms": "Bedrooms",
    "bathrooms": "Bathrooms",
    "property_type": "Property Type",
    "select_amenities": "Select Amenities",
    "apply_filters": "Apply Filters",
    "reset_filters": "Reset Filters",
    "sort_by": "Sort By",
    "newest": "Newest",
    "price_low_high": "Price: Low to High",
    "price_high_low": "Price: High to Low",

    // List property page translations
    "list_property_title": "List Your Property with An Jia You Xuan",
    "list_property_subtitle": "Join thousands of property owners who trust An Jia You Xuan to connect them with quality tenants",
    "why_list_with_us": "Why List with An Jia You Xuan?",
    "verified_tenants": "Verified Tenants",
    "verified_tenants_description": "We verify all tenant profiles to ensure you're connecting with reliable renters.",
    "secure_platform": "Secure Platform",
    "secure_platform_description": "Our platform includes secure messaging and payment processing for peace of mind.",
    "comprehensive_tools": "Comprehensive Listing Tools",
    "comprehensive_tools_description": "Create detailed listings with photos, virtual tours, and all the information tenants need.",
    "performance_analytics": "Performance Analytics",
    "performance_analytics_description": "Track views, inquiries, and engagement with your property listings through our detailed analytics.",
    "what_hosts_say": "What Our Hosts Say",
    "get_started": "Fill out the form below to get started",

    // List property form translations
    "property_type": "Property Type",
    "select_property_type": "Select property type",
    "apartment": "Apartment",
    "house": "House",
    "villa": "Villa",
    "condominium": "Condominium",
    "studio": "Studio",
    "property_title": "Property Title",
    "property_title_placeholder": "e.g. Modern Apartment in Kololo",
    "property_description": "Description",
    "property_description_placeholder": "Describe your property in detail...",
    "select_bedrooms": "Select",
    "select_bathrooms": "Select",
    "monthly_rent": "Monthly Rent",
    "rent_placeholder": "e.g. 1200",
    "select_currency": "Select currency",
    "location": "Location",
    "select_location": "Select location",
    "full_address": "Full Address",
    "address_placeholder": "Street address",
    "amenities": "Amenities",
    "wifi": "Wifi",
    "parking": "Parking",
    "generator": "Generator",
    "security": "Security",
    "swimming_pool": "Swimming Pool",
    "gym": "Gym",
    "contact_name": "Contact Name",
    "contact_name_placeholder": "Your name",
    "contact_email": "Contact Email",
    "contact_email_placeholder": "Your email",
    "contact_phone": "Contact Phone",
    "contact_phone_placeholder": "Your phone number",
    "terms_agreement": "I agree to the terms and conditions",
    "continue": "Continue",
    "back": "Back",
    "submitting": "Submitting...",
    "submit_property": "Submit Property",
    "success_title": "Property Submitted Successfully!",
    "success_message": "Your property has been submitted for review. We'll notify you once it's approved and live on our platform.",
    "go_to_dashboard": "Go to Dashboard",
    "list_another": "List Another Property",
  },
  zh: {
    "featured_properties": "精选房产",
    "discover_premium": "探索我们在坎帕拉的精选优质房产",
    "view_all_properties": "查看所有房产",
    "properties": "房产",
    "neighborhoods": "社区",
    "about": "关于我们",
    "contact": "联系我们",
    "home": "首页",
    "sign_in": "登录",
    "sign_up": "注册",
    "list_property": "发布您的房产",
    "back_to_properties": "返回房产列表",
    "contact_agent": "联系代理",
    "save_property": "收藏房产",
    "saved": "已收藏",
    "beds": "床",
    "bed": "床",
    "baths": "浴室",
    "bath": "浴室",
    "description": "描述",
    "property_summary": "房产概要",
    "amenities": "设施",
    "find_your_perfect_home": "在坎帕拉找到您的理想住所",
    "discover_best_properties": "探索坎帕拉最理想社区的最佳房产。无论您是想租房还是买房，我们都能为您提供完美的住所。",
    "become_host": "成为安家优选房东",
    "list_your_property": "在安家优选上发布您的房产，接触数千名寻找坎帕拉下一个家的潜在租户。",
    "free_listing_creation": "免费创建房源",
    "powerful_property_management_dashboard": "强大的房产管理仪表板",
    "direct_connection_with_potential_tenants": "与潜在租户直接联系",
    "start_hosting": "开始出租",

    // About page translations
    "about_hero_title": "连接坎帕拉的租户与他们的完美住所",
    "about_hero_description": "安家优选是一个专注于坎帕拉住房市场的Airbnb风格租赁平台，房主可以在这里列出可用单位，潜在租户可以找到他们理想的家。",
    "browse_properties": "浏览房产",
    "explore_neighborhoods": "探索社区",
    "our_mission": "我们的使命",
    "mission_description_1": "安家优选的创立有一个简单的使命：使在坎帕拉寻找和租赁房产变得简单、透明和愉快。我们相信每个人都应该拥有一个可以称之为家的地方，我们致力于将租户与他们的完美匹配连接起来。",
    "mission_description_2": "我们的平台将房产所有者、代理商和租户聚集在一起，创造一个充满活力的市场，满足坎帕拉住房市场的独特需求。",
    "trusted_by_many": "受到数百名房产所有者和租户的信任",
    "who_we_serve": "我们服务的对象",
    "who_we_serve_description": "安家优选旨在满足坎帕拉租赁市场中每个参与者的需求。",
    "property_seekers": "寻找房产者",
    "property_seekers_description": "在坎帕拉寻找下一个家的个人和家庭",
    "easy_search": "使用高级筛选器轻松搜索",
    "detailed_property_info": "详细的房产信息",
    "neighborhood_guides": "社区指南",
    "direct_contact": "与业主/代理商直接联系",
    "property_owners": "房产所有者",
    "property_owners_description": "在坎帕拉拥有住宅房产的个人",
    "free_listings": "免费基本房源",
    "property_management": "房产管理仪表板",
    "inquiry_management": "询问管理",
    "performance_analytics": "性能分析",
    "real_estate_agencies": "房地产代理机构",
    "agencies_description": "管理多个房产的专业机构",
    "bulk_uploads": "批量上传房产",
    "team_management": "团队管理",
    "advanced_analytics": "高级分析",
    "agency_profile": "机构资料页面",
    "key_features": "主要功能",
    "key_features_description": "安家优选提供全面的功能，旨在使坎帕拉的房产租赁无缝高效。",
    "advanced_search": "高级搜索和筛选",
    "advanced_search_description": "使用我们强大的搜索工具找到您正在寻找的内容。按位置、价格、卧室、设施等进行筛选。",
    "neighborhood_guides_feature": "社区指南",
    "neighborhood_guides_description": "关于坎帕拉社区的详细信息，帮助您对居住地做出明智的决定。",
    "maps_integration": "谷歌地图集成",
    "maps_integration_description": "通过集成地图，准确查看房产位置并探索周边地区。",
    "currency_flexibility": "货币灵活性",
    "currency_flexibility_description": "在UGX和USD之间切换，以您喜欢的货币查看价格。",
    "verified_listings": "已验证房源",
    "verified_listings_description": "所有房产都经过验证流程，确保信息的准确性和可靠性。",
    "rich_property_details": "丰富的房产详情",
    "rich_property_details_description": "关于每个房产的全面信息，包括高质量照片、设施和详细描述。",
    "direct_contact_feature": "直接联系",
    "direct_contact_description": "通过WhatsApp或电话直接与房产所有者或代理商联系，获得快速回应。",
    "owner_dashboard": "业主仪表板",
    "owner_dashboard_description": "房产所有者可以访问强大的仪表板来管理房源和跟踪性能。",
    "ready_to_find_home": "准备找到您的完美住所？",
    "join_today": "今天加入安家优选，发现坎帕拉提供的最佳租赁房产。",

    // Neighborhoods page translations
    "discover_neighborhoods": "探索坎帕拉的社区",
    "neighborhoods_description": "探索坎帕拉多样化的社区，为您的下一个家找到完美的区域。",
    "properties_available": "可用房产",
    "avg_price": "平均价格",
    "view_properties": "查看房产",
    "learn_more": "了解更多",
    "naguru_description": "美丽的景色和不断增长的外籍人士社区",
    "kololo_description": "高档住宅区，拥有大使馆和豪华住宅",
    "bukoto_description": "充满活力的区域，受年轻专业人士欢迎",
    "bugolobi_description": "宁静的住宅区，拥有出色的设施",
    "ntinda_description": "适合家庭的社区，购物便利",
    "mutungo_description": "被称为'坦克山'，拥有全景湖景",

    // Properties page translations
    "all_properties": "所有房产",
    "filter_properties": "筛选房产",
    "price_range": "价格范围",
    "min_price": "最低价格",
    "max_price": "最高价格",
    "bedrooms": "卧室",
    "bathrooms": "浴室",
    "property_type": "房产类型",
    "select_amenities": "选择设施",
    "apply_filters": "应用筛选",
    "reset_filters": "重置筛选",
    "sort_by": "排序方式",
    "newest": "最新",
    "price_low_high": "价格：从低到高",
    "price_high_low": "价格：从高到低",

    // List property page translations
    "list_property_title": "在安家优选上发布您的房产",
    "list_property_subtitle": "加入数千名信任安家优选的房产所有者，与优质租户建立联系",
    "why_list_with_us": "为什么选择在安家优选发布房源？",
    "verified_tenants": "已验证租户",
    "verified_tenants_description": "我们验证所有租户档案，确保您与可靠的租户建立联系。",
    "secure_platform": "安全平台",
    "secure_platform_description": "我们的平台包括安全的消息和支付处理，让您安心无忧。",
    "comprehensive_tools": "全面的房源工具",
    "comprehensive_tools_description": "创建详细的房源信息，包括照片、虚拟游览和租户需要的所有信息。",
    "performance_analytics": "性能分析",
    "performance_analytics_description": "通过详细的分析追踪您房源的浏览量、咨询量和参与度。",
    "what_hosts_say": "房东怎么说",
    "get_started": "填写以下表格开始",

    // List property form translations
    "property_type": "房产类型",
    "select_property_type": "选择房产类型",
    "apartment": "公寓",
    "house": "独栋房屋",
    "villa": "别墅",
    "condominium": "共管公寓",
    "studio": "开间",
    "property_title": "房产标题",
    "property_title_placeholder": "例如：科罗洛现代公寓",
    "property_description": "描述",
    "property_description_placeholder": "详细描述您的房产...",
    "select_bedrooms": "选择",
    "select_bathrooms": "选择",
    "monthly_rent": "月租",
    "rent_placeholder": "例如：1200",
    "select_currency": "选择货币",
    "location": "位置",
    "select_location": "选择位置",
    "full_address": "详细地址",
    "address_placeholder": "街道地址",
    "amenities": "设施",
    "wifi": "无线网络",
    "parking": "停车位",
    "generator": "发电机",
    "security": "安保",
    "swimming_pool": "游泳池",
    "gym": "健身房",
    "contact_name": "联系人姓名",
    "contact_name_placeholder": "您的姓名",
    "contact_email": "联系邮箱",
    "contact_email_placeholder": "您的邮箱",
    "contact_phone": "联系电话",
    "contact_phone_placeholder": "您的电话号码",
    "terms_agreement": "我同意服务条款",
    "continue": "继续",
    "back": "返回",
    "submitting": "提交中...",
    "submit_property": "提交房产",
    "success_title": "房产提交成功！",
    "success_message": "您的房产已提交审核。一旦审核通过并上线，我们会通知您。",
    "go_to_dashboard": "前往仪表板",
    "list_another": "发布另一处房产",
  },
  ja: {
    "featured_properties": "おすすめ物件",
    "discover_premium": "カンパラの厳選された高級物件をご覧ください",
    "view_all_properties": "すべての物件を見る",
    "properties": "物件",
    "neighborhoods": "近隣地域",
    "about": "会社概要",
    "contact": "お問い合わせ",
    "home": "ホーム",
    "sign_in": "ログイン",
    "sign_up": "登録",
    "list_property": "物件を掲載する",
    "back_to_properties": "物件一覧に戻る",
    "contact_agent": "担当者に連絡する",
    "save_property": "物件を保存",
    "saved": "保存済み",
    "beds": "ベッド",
    "bed": "ベッド",
    "baths": "バスルーム",
    "bath": "バスルーム",
    "description": "説明",
    "property_summary": "物件概要",
    "amenities": "設備",
    "find_your_perfect_home": "カンパラで理想の住まいを見つける",
    "discover_best_properties": "カンパラの最も人気のあるエリアで最高の物件を発見しましょう。賃貸または購入をお考えの方に、最適な物件をご用意しています。",
    "become_host": "安家優選のホストになる",
    "list_your_property": "安家優選に物件を掲載して、カンパラで次の住まいを探している何千人もの潜在的な借主にアピールしましょう。",
    "free_listing_creation": "無料で物件掲載",
    "powerful_property_management_dashboard": "強力な物件管理ダッシュボード",
    "direct_connection_with_potential_tenants": "潜在的な借主との直接のつながり",
    "start_hosting": "ホスティングを始める",

    // About page translations
    "about_hero_title": "カンパラの借主と理想の住まいをつなぐ",
    "about_hero_description": "安家優選は、カンパラの住宅市場に特化したAirbnbスタイルのレンタルプラットフォームで、物件所有者が利用可能な物件を掲載し、潜在的な借主が理想の住まいを見つけることができます。",
    "browse_properties": "物件を閲覧",
    "explore_neighborhoods": "近隣地域を探索",
    "our_mission": "私たちの使命",
    "mission_description_1": "安家優選は、カンパラでの物件探しと賃貸をシンプルで透明性が高く、楽しいものにするという簡単な使命を持って設立されました。誰もが自分の家と呼べる場所を持つべきだと信じており、借主と完璧なマッチングを実現することに取り組んでいます。",
    "mission_description_2": "私たちのプラットフォームは、物件所有者、エージェント、借主を一か所に集め、カンパラの住宅市場の独自のニーズに応える活気あるマーケットプレイスを作り出しています。",
    "trusted_by_many": "何百もの物件所有者と借主に信頼されています",
    "who_we_serve": "サービス対象",
    "who_we_serve_description": "安家優選は、カンパラのレンタル市場に関わるすべての人のニーズを満たすために設計されています。",
    "property_seekers": "物件を探している方",
    "property_seekers_description": "カンパラで次の住まいを探している個人や家族",
    "easy_search": "高度なフィルターで簡単に検索",
    "detailed_property_info": "詳細な物件情報",
    "neighborhood_guides": "近隣地域ガイド",
    "direct_contact": "所有者/エージェントとの直接連絡",
    "property_owners": "物件所有者",
    "property_owners_description": "カンパラに住宅物件を所有している個人",
    "free_listings": "無料の基本掲載",
    "property_management": "物件管理ダッシュボード",
    "inquiry_management": "問い合わせ管理",
    "performance_analytics": "パフォーマンス分析",
    "real_estate_agencies": "不動産会社",
    "agencies_description": "複数の物件を管理するプロフェッショナルな会社",
    "bulk_uploads": "一括物件アップロード",
    "team_management": "チーム管理",
    "advanced_analytics": "高度な分析",
    "agency_profile": "会社プロフィールページ",
    "key_features": "主な機能",
    "key_features_description": "安家優選は、カンパラでの物件賃貸をスムーズで効率的にするための包括的な機能を提供しています。",
    "advanced_search": "高度な検索とフィルター",
    "advanced_search_description": "強力な検索ツールで探しているものを正確に見つけることができます。場所、価格、寝室数、設備などでフィルタリングできます。",
    "neighborhood_guides_feature": "近隣地域ガイド",
    "neighborhood_guides_description": "カンパラの近隣地域に関する詳細情報で、どこに住むかについて情報に基づいた決断を下すのに役立ちます。",
    "maps_integration": "Googleマップ連携",
    "maps_integration_description": "統合されたマップで物件の正確な場所を確認し、周辺エリアを探索できます。",
    "currency_flexibility": "通貨の柔軟性",
    "currency_flexibility_description": "UGXとUSDを切り替えて、希望の通貨で価格を表示できます。",
    "verified_listings": "検証済み物件",
    "verified_listings_description": "すべての物件は情報の正確性と信頼性を確保するための検証プロセスを経ています。",
    "rich_property_details": "豊富な物件詳細",
    "rich_property_details_description": "高品質の写真、設備、詳細な説明を含む各物件に関する包括的な情報。",
    "direct_contact_feature": "直接連絡",
    "direct_contact_description": "WhatsAppや電話で物件所有者やエージェントと直接連絡し、迅速な対応を得ることができます。",
    "owner_dashboard": "オーナーダッシュボード",
    "owner_dashboard_description": "物件所有者は強力なダッシュボードにアクセスして、物件を管理しパフォーマンスを追跡できます。",
    "ready_to_find_home": "理想の住まいを見つける準備はできていますか？",
    "join_today": "今日安家優選に参加して、カンパラが提供する最高の賃貸物件を発見しましょう。",

    // Neighborhoods page translations
    "discover_neighborhoods": "カンパラの近隣地域を発見",
    "neighborhoods_description": "カンパラの多様な近隣地域を探索し、次の住まいに最適なエリアを見つけましょう。",
    "properties_available": "利用可能な物件",
    "avg_price": "平均価格",
    "view_properties": "物件を見る",
    "learn_more": "詳細を見る",
    "naguru_description": "美しい景色と成長する外国人コミュニティ",
    "kololo_description": "大使館や高級住宅がある高級住宅地",
    "bukoto_description": "若いプロフェッショナルに人気の活気ある地域",
    "bugolobi_description": "優れた設備を備えた静かな住宅地",
    "ntinda_description": "ファミリー向けの地域、買い物が便利",
    "mutungo_description": "'タンクヒル'として知られる、パノラマの湖の景色がある地域",

    // Properties page translations
    "all_properties": "すべての物件",
    "filter_properties": "物件をフィルタリング",
    "price_range": "価格帯",
    "min_price": "最低価格",
    "max_price": "最高価格",
    "bedrooms": "寝室数",
    "bathrooms": "バスルーム数",
    "property_type": "物件タイプ",
    "select_amenities": "設備を選択",
    "apply_filters": "フィルターを適用",
    "reset_filters": "フィルターをリセット",
    "sort_by": "並び替え",
    "newest": "最新",
    "price_low_high": "価格：安い順",
    "price_high_low": "価格：高い順",

    // List property page translations
    "list_property_title": "安家優選で物件を掲載",
    "list_property_subtitle": "何千人もの物件所有者が安家優選を信頼し、質の高い借主とつながっています",
    "why_list_with_us": "安家優選で掲載する理由",
    "verified_tenants": "認証済みの借主",
    "verified_tenants_description": "すべての借主プロフィールを確認し、信頼できる借主とのマッチングを確保します。",
    "secure_platform": "安全なプラットフォーム",
    "secure_platform_description": "安全なメッセージングと決済処理を含むプラットフォームで安心を提供します。",
    "comprehensive_tools": "包括的な掲載ツール",
    "comprehensive_tools_description": "写真、バーチャルツアー、借主が必要とするすべての情報を含む詳細な掲載が可能です。",
    "performance_analytics": "パフォーマンス分析",
    "performance_analytics_description": "詳細な分析で物件の閲覧数、問い合わせ、エンゲージメントを追跡できます。",
    "what_hosts_say": "オーナーの声",
    "get_started": "以下のフォームに記入して始めましょう",

    // List property form translations
    "property_type": "物件タイプ",
    "select_property_type": "物件タイプを選択",
    "apartment": "アパート",
    "house": "一戸建て",
    "villa": "ヴィラ",
    "condominium": "マンション",
    "studio": "ワンルーム",
    "property_title": "物件名",
    "property_title_placeholder": "例：コロロのモダンアパート",
    "property_description": "説明",
    "property_description_placeholder": "物件の詳細を説明してください...",
    "select_bedrooms": "選択",
    "select_bathrooms": "選択",
    "monthly_rent": "月額賃料",
    "rent_placeholder": "例：1200",
    "select_currency": "通貨を選択",
    "location": "所在地",
    "select_location": "所在地を選択",
    "full_address": "詳細住所",
    "address_placeholder": "住所",
    "amenities": "設備",
    "wifi": "Wi-Fi",
    "parking": "駐車場",
    "generator": "発電機",
    "security": "セキュリティ",
    "swimming_pool": "プール",
    "gym": "ジム",
    "contact_name": "担当者名",
    "contact_name_placeholder": "お名前",
    "contact_email": "メールアドレス",
    "contact_email_placeholder": "メールアドレス",
    "contact_phone": "電話番号",
    "contact_phone_placeholder": "電話番号",
    "terms_agreement": "利用規約に同意する",
    "continue": "続ける",
    "back": "戻る",
    "submitting": "送信中...",
    "submit_property": "物件を登録",
    "success_title": "物件登録が完了しました！",
    "success_message": "物件は審査に送られました。承認され掲載された際にお知らせいたします。",
    "go_to_dashboard": "ダッシュボードへ",
    "list_another": "別の物件を登録",
  }
};

// Create the language context
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: languages[0],
  translate: (key) => key,
  changeLanguage: () => {},
});

// Export the hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Add custom translations to the default translations
  const enhancedTranslations = addCustomTranslations(defaultTranslations);

  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [translations, setTranslations] = useState(enhancedTranslations);

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      const lang = languages.find(l => l.code === savedLanguage);
      if (lang) {
        setCurrentLanguage(lang);
      }
    }
  }, []);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language.code);
  };

  const translate = (key: string): string => {
    const langCode = currentLanguage.code;
    return translations[langCode as keyof typeof translations]?.[key as keyof typeof defaultTranslations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, translate, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-neutral-200 shadow-sm gap-2 hover:border-neutral-300"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{currentLanguage.nativeName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="py-2">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              className="w-full justify-start rounded-none h-9 px-3"
              onClick={() => handleLanguageChange(language)}
            >
              <div className="flex items-center justify-between w-full">
                <span>
                  {language.nativeName} <span className="text-neutral-500">({language.name})</span>
                </span>
                {currentLanguage.code === language.code && <Check className="h-4 w-4 text-rose-500" />}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
