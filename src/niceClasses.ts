/**
 * Official Nice Classification (1 to 45) for Iraqi Intellectual Property Registry
 * class-by-class Goods & Services descriptions in English & Arabic.
 */

export interface NiceClass {
  number: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export const NICE_CLASSES: NiceClass[] = [
  {
    number: "1",
    nameEn: "Chemicals",
    nameAr: "المواد الكيميائية",
    descriptionEn: "Chemicals for use in industry, science, agriculture, and forestry; unprocessed plastics; chemical tempering and soldering preparations.",
    descriptionAr: "المواد الكيميائية المستخدمة في الصناعة والعلوم والزراعة والغابات والبحوث؛ المواد البلاستيكية الخام؛ ومستحضرات تليين وتلحيم المعادن والسبائك."
  },
  {
    number: "2",
    nameEn: "Paints & Varnishes",
    nameAr: "الدهانات والطلاءات",
    descriptionEn: "Paints, varnishes, lacquers; preservatives against rust and deterioration of wood; colorants, dyestuffs; mordants; raw natural resins.",
    descriptionAr: "الدهانات والطلاءات والورنيشات؛ ومواد وقاية الأخشاب والمعادن من الصدأ أو الرطوبة؛ مواد تلوين الأصبغة؛ الراتنجات الطبيعية الخام."
  },
  {
    number: "3",
    nameEn: "Cosmetics & Laundry",
    nameAr: "مستحضرات التجميل والغسيل",
    descriptionEn: "Non-medicated cosmetics and toiletry preparations; perfumes, essential oils; bleaching preparations and other substances for laundry use; soaps.",
    descriptionAr: "مستحضرات التجميل غير الطبية والعطور الفاخرة؛ الزيوت العطرية والأساسية؛ مستحضرات تنظيف وتبييض الملابس؛ الصابون الفاخر ومستحضرات الاستحمام."
  },
  {
    number: "4",
    nameEn: "Industrial Oils & Fuels",
    nameAr: "الزيوت والوقود الصناعي",
    descriptionEn: "Industrial oils and greases; lubricants; dust absorbing, wetting and binding compositions; fuels (including motor spirit) and illuminants; candles.",
    descriptionAr: "الزيوت والشحوم الصناعية والمواد الكربوناتية؛ مواد تزييت وتشحيم الآلات؛ تركيبات لامتصاص الأتربة وتبليلها؛ وقود التشغيل بما فيه وقود المحركات ومواد توليد الإنارة؛ الشموع."
  },
  {
    number: "5",
    nameEn: "Pharmaceuticals",
    nameAr: "الأدوية والمستحضرات الطبية",
    descriptionEn: "Pharmaceuticals, medical and veterinary preparations; sanitary preparations for medical purposes; dietetic food; medicines for human beings.",
    descriptionAr: "المستحضرات الصيدلانية والطبية والبيطرية؛ المستحضرات الصحية والتعقيمية للأغراض الطبية؛ المواد الغذائية المناسبة للحمية والمكملات لمرضى السكري والقلب."
  },
  {
    number: "6",
    nameEn: "Metal Goods & Aluminum",
    nameAr: "المعادن والسبائك المعدنية",
    descriptionEn: "Common metals and their alloys, ores; metal materials for building and construction; transportable buildings of metal; cables and wires of common metal.",
    descriptionAr: "المعادن العادية وسبائكها وخاماتها؛ المواد المعدنية للبناء والتشييد؛ الهياكل والبيوت الجاهزة المعدنية المتنقلة؛ كابلات وأسلاك مصنوعة من حديد وألمنيوم."
  },
  {
    number: "7",
    nameEn: "Machinery & Heavy Motors",
    nameAr: "الآلات والمحركات الكبيرة",
    descriptionEn: "Machines and machine tools; motors and engines (except for land vehicles); machine coupling and transmission components; agricultural implements.",
    descriptionAr: "الآلات والمعدات الميكانيكية وأدوات القطع؛ المحركات والتوربينات (بخلاف تلك المخصصة للعربات البرية)؛ قطع ناقلات الحركة ومقرنات الآليات؛ المولدات الكهربائية وصمامات التشغيل."
  },
  {
    number: "8",
    nameEn: "Hand Tools & Utensils",
    nameAr: "أدوات ومعدات يدوية",
    descriptionEn: "Hand tools and implements (hand-operated); cutlery; side arms; razors.",
    descriptionAr: "الأدوات والمعدات اليدوية التي يتم تشغيلها باليد؛ السكاكين وأدوات المائدة؛ الأسلحة الجانبية؛ شفرات الحلاقة ومقصات التقليم الصناعية."
  },
  {
    number: "9",
    nameEn: "Electronics & Computers",
    nameAr: "الإلكترونيات والبرمجيات",
    descriptionEn: "Scientific, research, navigation, surveying, photographic, cinematographic, audiovisual, optical, weighing, measuring, signaling, detecting, testing, inspecting, life-saving and teaching apparatus and instruments; software, computers, microchips.",
    descriptionAr: "الأجهزة والمعدات العلمية والبحثية والملاحة والتصوير والسينمائي؛ الأجهزة البصرية والوزن والقياس والإشارة والتحذير؛ أجهزة الحاسوب والبرمجيات وشاشات العرض الذكية."
  },
  {
    number: "10",
    nameEn: "Medical Apparatus",
    nameAr: "الأجهزة الطبية ومستلزمات العلاج",
    descriptionEn: "Surgical, medical, dental and veterinary apparatus and instruments; artificial limbs, eyes and teeth; orthopedic articles; suture materials.",
    descriptionAr: "الأدوات والمعدات الجراحية والطبية والبيطرية وأجهزة فحص الأسنان؛ الأطراف الصناعية والعيون والأسنان البديلة؛ مستلزمات تقويم العظام ومواد خياطة الجروح المعقمة."
  },
  {
    number: "11",
    nameEn: "Environmental Controls",
    nameAr: "أجهزة التكييف والإنارة والتبريد",
    descriptionEn: "Apparatus for lighting, heating, steam generating, cooking, refrigerating, drying, ventilating, water supply and sanitary purposes.",
    descriptionAr: "المعدات والأجهزة المستخدمة في الإنارة والتدفئة وتوليد البخار والطهي؛ المبردات ومكيفات الهواء المنزلية والصناعية ومحطات تصفية وتوزيع المياه."
  },
  {
    number: "12",
    nameEn: "Vehicles & Transport",
    nameAr: "المركبات ووسائط النقل بر وبحر",
    descriptionEn: "Vehicles; apparatus for locomotion by land, air or water.",
    descriptionAr: "المركبات والعربات والسيارات وباصات النقل؛ القوارب وفيلكا البحر ومحركات الملاحة الجوية والبرية."
  },
  {
    number: "13",
    nameEn: "Firearms & Explosives",
    nameAr: "الأسلحة والذخائر والمفرقعات",
    descriptionEn: "Firearms; ammunition and projectiles; explosives; fireworks.",
    descriptionAr: "الأسلحة النارية الفردية؛ الذخائر والمقذوفات العسكرية؛ المواد المتفجرة والمفرقعات وألعاب النيران المناسباتية."
  },
  {
    number: "14",
    nameEn: "Jewelry & Precious Metals",
    nameAr: "المجوهرات والمعادن الثمينة وساعات",
    descriptionEn: "Precious metals and their alloys; jewelry, precious and semi-precious stones; horological and chronometric instruments; watches.",
    descriptionAr: "المعادن النفيسة والذهب والفضة والسبائك؛ المجوهرات والأحجار الكريمة وشبه الكريمة؛ ساعات اليد وساعات الجدران والكرونومترات والمنبهات."
  },
  {
    number: "15",
    nameEn: "Musical Instruments",
    nameAr: "الآلات الموسيقية",
    descriptionEn: "Musical instruments; music stands and stands for musical instruments; conductors' batons.",
    descriptionAr: "الآلات والمعدات الموسيقية التقليدية والحديثة؛ عازف البيانو والعود والكمان والدنبك؛ قواعد أوراق النغمات وعصى قادة الفرق السمفونية."
  },
  {
    number: "16",
    nameEn: "Paper & Stationery",
    nameAr: "الورق والقرطاسية والمطبوعات",
    descriptionEn: "Paper and cardboard; printed matter; bookbinding material; photographs; stationery and office requisites; plastic sheets, films and bags for wrapping and packaging.",
    descriptionAr: "الورق والكرتون المقوى؛ المواد المطبوعة والكتب والمجلات؛ مستلزمات تجليد الدفاتر وحفظ الصور؛ القرطاسية وأدوات الكتابة والمكاتب؛ أكياس تعبئة بلاستيكية وورق تغليف."
  },
  {
    number: "17",
    nameEn: "Rubber & Insulators",
    nameAr: "المطاط ومواد العزل الحراري",
    descriptionEn: "Unprocessed and semi-processed rubber, gutta-percha, gum, asbestos, mica and substitutes for all these materials; plastics and resins in extruded form; packing, stopping and insulating materials.",
    descriptionAr: "المطاط الخام وشبه المصلح واللدائن ومواد اللثة؛ الأسبيستوس ومسحوق الميكا؛ مواد التغليف ومنع تسريب المياه والزيوت، ومواد عزل الحرارة والصوت للجدران."
  },
  {
    number: "18",
    nameEn: "Leather Goods & Bags",
    nameAr: "الجلود والحقائب والمحافظ",
    descriptionEn: "Leather and imitations of leather; animal skins and hides; luggage and carrying bags; umbrellas and parasols; walking sticks; whips, harness and saddlery.",
    descriptionAr: "الجلود الطبيعية والاصطناعية؛ جلود الحيوانات المدبوغة؛ حقائب السفر وحقائب اليد والمحافظ الجلدية؛ المظلات الشمسية وعكازات المشي ولوازم السرج العتيق."
  },
  {
    number: "19",
    nameEn: "Building Construction Materials",
    nameAr: "مواد البناء والأنصاب ومرمر",
    descriptionEn: "Materials, not of metal, for building and construction; rigid pipes, not of metal, for building; asphalt, pitch, tar and bitumen; non-metallic transportable buildings.",
    descriptionAr: "مواد البناء والتشييد غير المعدنية؛ الاسمنت والجبس والمرمر والأحجار والآجر والطابوق؛ أنابيب المباني البلاستيكية؛ الأسفلت والقطران والقار للتعبيد؛ غرف متنقلة غير معدنية."
  },
  {
    number: "20",
    nameEn: "Furniture & Decor",
    nameAr: "الأثاث والمفروشات الخشبية",
    descriptionEn: "Furniture, mirrors, picture frames; containers, not of metal, for storage or transport; unworked or semi-worked bone, horn, whalebone or mother-of-pearl; shells; meerschaum; yellow amber.",
    descriptionAr: "الأثاث المنزلي والمكتبي والديكورات والمرايا؛ إطارات الصور واللوحات؛ حاويات النقل والتخزين غير المعدنية؛ العظام والقرون وصدف اللؤلؤ المصنع جزئياً والخشب الطبيعي."
  },
  {
    number: "21",
    nameEn: "Household Utentils & Glass",
    nameAr: "أدوات المطبخ والزجاج والخزف",
    descriptionEn: "Household or kitchen utensils and containers; cookware and tableware, except forks, knives and spoons; combs and sponges; brushes; unworked or semi-worked glass.",
    descriptionAr: "الأواني والأدوات المنزلية والمطبخية؛ طناجر الطبخ ومواعين الطعام الزجاجية والخزفية وسلال الحفظ؛ الأمشاط والاسفنج؛ الفراشي؛ الزجاج غير المصنع أو شبه المصنع."
  },
  {
    number: "22",
    nameEn: "Ropes, Nets & Sails",
    nameAr: "الحبال والخيوط وشباك الصيد",
    descriptionEn: "Ropes and string; nets; tents and tarpaulins; awnings of textile or synthetic materials; sails; sacks for the transport and storage of materials in bulk.",
    descriptionAr: "الحبال والحبال السميكة؛ خيوط الصيد والشباك؛ الخيم والأشرعة والشوادر المصنوعة من الألياف أو الكتان؛ شوالات الخيش وحفظ المحاصيل والحبوب بالجملة."
  },
  {
    number: "23",
    nameEn: "Yarns & Threads",
    nameAr: "الغزل والخيوط النسيجية",
    descriptionEn: "Yarns and threads for textile use.",
    descriptionAr: "خيوط الغزل والنسيج والخياطة؛ خيط التطريز والقطن الصافي المخصص للتصميم الصناعي النسيجي."
  },
  {
    number: "24",
    nameEn: "Textiles & Fabrics",
    nameAr: "الأقمشة والمنسوجات والبطانيات",
    descriptionEn: "Textiles and substitutes for textiles; household linen; curtains of textile or plastic.",
    descriptionAr: "الأقمشة والمنسوجات وبدائلها النسيجية؛ بياضات الأسرة والفرش والمخاد؛ ستائر الغرف والصالات المصنوعة من الكتان أو الخيط والنايلون."
  },
  {
    number: "25",
    nameEn: "Clothing & Footwear",
    nameAr: "الملابس والأحذية والملابس الرياضية",
    descriptionEn: "Clothing, footwear, headwear.",
    descriptionAr: "الملابس الجاهرة بجميع أصنافها، المعاطف، الأزياء؛ الأحذية والنعال الرجالية والنسائية؛ القبعات واليشماغ والملابس الرياضية والتقليدية."
  },
  {
    number: "26",
    nameEn: "Lace, Ribbons & Embroidery",
    nameAr: "أربطة الديكور والشرائط ومطرزات",
    descriptionEn: "Lace, braid and embroidery, and haberdashery ribbons and bows; buttons, hooks and eyes, pins and needles; artificial flowers; hair decorations; false hair.",
    descriptionAr: "الأربطة المزخرفة والشرائط والمطرزات الحريرية والذهبية؛ الأزرار الكبيرة والخطافات والدبابيس والإبر؛ الزهور الاصطناعية؛ زينة الشعر البلاستيكية والشعر المستعار."
  },
  {
    number: "27",
    nameEn: "Carpets & Rugs",
    nameAr: "السجاد والموكيت وبسط أرضيات",
    descriptionEn: "Carpets, rugs, mats and matting, linoleum and other materials for covering existing floors; wall hangings, not of textile.",
    descriptionAr: "السجاد اليدوي والمصنع الفاخر؛ الموكيت والبسط وحصائر القصب والنايلون؛ المشمع ومواد التغطية الجاهزة للأرضيات والباركيه وجدران العزل."
  },
  {
    number: "28",
    nameEn: "Toys & Gaming Goods",
    nameAr: "الألعاب والأدوات الرياضية والترفيه",
    descriptionEn: "Games, toys and playthings; video game apparatus; gymnastic and sporting articles; decorations for Christmas trees.",
    descriptionAr: "الألعاب والدمى وأدوات اللعب والأطفال؛ أجهزة وبرمجيات الكونسول والفيديو كيم؛ الأدوات والمعدات الرياضية واللياقة؛ أدوات التسلية وألعاب الطاولة الشهيرة."
  },
  {
    number: "29",
    nameEn: "Meats, Oils & Preserved Dates",
    nameAr: "اللحوم والمعلبات والتمور المحفوظة",
    descriptionEn: "Meat, fish, poultry and game; meat extracts; preserved, frozen, dried and cooked fruits and vegetables; jellies, jams, compotes; eggs; milk, cheese, butter, yogurt; oils and fats for food; and processed dates.",
    descriptionAr: "اللحوم والدواجن والأسماك والخضروات والتمور؛ خلاصات اللحوم والشوربة الجاهزة؛ الفواكه المجففة والمطبخة؛ الجبن واللبن والحليب والزبدة؛ ومكثفات التمور وسيرب الدبس التمور الشهير."
  },
  {
    number: "30",
    nameEn: "Coffee, Tea & Flour Pastry",
    nameAr: "القهوة والشاي والطحين والحلويات",
    descriptionEn: "Coffee, tea, cocoa and artificial coffee; rice, pasta and noodles; tapioca and sago; flour and preparations made from cereals; bread, pastry and confectionery; chocolate; ice cream, sorbets; sugar, honey, treacle; yeast, baking-powder; salt, seasonings, spices, preserved herbs; vinegar, sauces.",
    descriptionAr: "القهوة والشاي والكاكاو والبدائل الطبية؛ الرز والمعكرونة والشعيرية؛ الدقيق والطحين المعالج من الحبوب؛ المعجنات والحلويات والبسكويت والشوكولاتة والشعير؛ عسل النحل والسكاكر؛ الهيل والبهارات والتوابل؛ الخل والصلصات."
  },
  {
    number: "31",
    nameEn: "Agriculture & Grains",
    nameAr: "المنتجات الزراعية والحبوب والماشية",
    descriptionEn: "Raw and unprocessed agricultural, aquacultural, horticultural and forestry products; raw and unprocessed grains and seeds; fresh fruits and vegetables, fresh herbs; natural plants and flowers; bulbs, seedlings and seeds for planting; live animals; foodstuffs and beverages for animals; malt.",
    descriptionAr: "المحاصيل الزراعية والحبوب غير المعالجة؛ الأعشاب والزهور الطبيعية الطازجة؛ الشتلات والبذور المخصصة للزراعة؛ الماشية والحيوانات الحية وعلف المواشي والدواجن والطيور."
  },
  {
    number: "32",
    nameEn: "Beverages, Water & juices",
    nameAr: "المشروبات والمياه المعدنية والعصائر",
    descriptionEn: "Mineral and aerated waters and other non-alcoholic beverages; fruit beverages and fruit juices; syrups and other non-alcoholic preparations for making beverages.",
    descriptionAr: "المياه المعدنية النقية والمياه الفوارة والغازية والمشروبات غير الكحولية؛ عصائر الفواكه الطبيعية والمركبات والشراب لصناعة المشروبات المبردة."
  },
  {
    number: "33",
    nameEn: "Alcoholic Beverages (Under limits)",
    nameAr: "المشروبات الروحية والمسكرات",
    descriptionEn: "Alcoholic beverages, except beers; preparations for making beverages.",
    descriptionAr: "المشروبات الكحولية بموجب اللوائح والنسب المعمول بها؛ المستحضرات والنكهات لتحضير المشروبات الكحولية."
  },
  {
    number: "34",
    nameEn: "Tobacco & Matches",
    nameAr: "التبغ والسجائر وأعواد الثقاب والولاعات",
    descriptionEn: "Tobacco and tobacco substitutes; cigarettes and cigars; electronic cigarettes and oral vaporizers; smokers' articles; matches.",
    descriptionAr: "التبغ وبدائله وورق السجائر؛ المعسل والسيجار والنيكوتين؛ السجائر الإلكترونية وملحقات المبخر الشمسي؛ الولاعات لعلب السجائر وأعواد الثقاب التقليدية."
  },
  {
    number: "35",
    nameEn: "Business Office & Advertising",
    nameAr: "إدارة الأعمال والخدمات المكتبية والإعلان",
    descriptionEn: "Advertising; business management, organization and administration; office functions; commercial administration of companies.",
    descriptionAr: "خدمات الدعاية والإعلام والترويج؛ تنظيم وإدارة المعامل والاستثمارات التجارية والشركات؛ الخدمات المكتبية وتيسير الأعمال؛ الوكالات والمعارض العامة."
  },
  {
    number: "36",
    nameEn: "Insurance & Financial Brokerage",
    nameAr: "الخدمات التأمينية والمصرفية والبورصة",
    descriptionEn: "Financial, monetary and banking services; insurance services; real estate affairs.",
    descriptionAr: "خدمات المصارف والبنوك وتحويل الأموال والصيرفة؛ خدمات التأمين الطبي والحوادث والشركات؛ الاستثمارات العقارية والوسطاء العقاريين لمناطق البناء."
  },
  {
    number: "37",
    nameEn: "Construction & Maintenance",
    nameAr: "أعمال البناء والتشييد والترميم والصيانة",
    descriptionEn: "Construction services; installation and repair services; mining extraction, oil and gas drilling.",
    descriptionAr: "خدمات البناء والمقاولات والتشييد المعماري؛ صيانة وترميم المنازل والمعدات؛ حفر آبار البترول واستخراج الثروات المعدنية والنفطية."
  },
  {
    number: "38",
    nameEn: "Telecommunications",
    nameAr: "خدمات الاتصالات والانترنت والبث",
    descriptionEn: "Telecommunication services; fiber optic networks, broadbands; television and radio broadcasting.",
    descriptionAr: "خدمات الاتصالات اللاسلكية والانترنت، وكابلات الألياف الضوئية؛ خدمات البث الإذاعي والتلفزيوني وتسيير القمر الصناعي."
  },
  {
    number: "39",
    nameEn: "Transport & Shipping",
    nameAr: "النقل والشحن والتخزين واللوجستيك",
    descriptionEn: "Transport; packaging and storage of goods; travel arrangement; shipping and delivery logistics.",
    descriptionAr: "عمليات النقل البري والبحري والجوي للركاب؛ تفريغ وحفظ البضائع في المخازن؛ والخدمات البريدية والدليفري السريع وشحن المنتجات دولياً."
  },
  {
    number: "40",
    nameEn: "Material Treatment & Milling",
    nameAr: "معالجة وتجليس وحياكة المواد والمطاحن",
    descriptionEn: "Treatment of materials; recycling of waste and trash; air purification and treatment of water; printing services; food and drink preservation.",
    descriptionAr: "معالجة وتحسين جودة المعادن والمواد الخام؛ حياكة وتطريز الأثواب والجلود والملابس؛ خدمات تدوير المياه والهواء؛ خدمات الطباعة وحفظ المأكولات والمشروبات من التلف."
  },
  {
    number: "41",
    nameEn: "Education & Entertainment Shows",
    nameAr: "التعليم والتدريب الأكاديمي والترفيه الفني",
    descriptionEn: "Education; providing of training; entertainment; sporting and cultural activities.",
    descriptionAr: "خدمات المدارس والجامعات والتعليم الأكاديمي؛ توفير دورات التدريب والشهادات المهنية؛ المهرجانات والعروض المسرحية والصالات والنوادي الثقافية والصحية."
  },
  {
    number: "42",
    nameEn: "Scientific & Software Engineering",
    nameAr: "تصميم البرمجيات والبحوث العلمية والهندسة",
    descriptionEn: "Scientific and technological services and research and design relating thereto; industrial analysis, industrial research and industrial design services; quality control and authentication services; design and development of computer hardware and software.",
    descriptionAr: "الخدمات التقنية والتكنولوجية وتطوير البرامج والمواقع الالكترونية وسيرفرات البث؛ بحوث الهندسة المعمارية والبيولوجية؛ معايرة وفحص جودة الصادرات والمنتجات."
  },
  {
    number: "43",
    nameEn: "Food Services & Hotels",
    nameAr: "المطاعم الفاخرة والفنادق السياحية",
    descriptionEn: "Services for providing food and drink; temporary accommodation; restaurants, cafes, hotels.",
    descriptionAr: "توفير المأكولات والمشروبات، والمطاعم الفاخرة، ومطاعم المطبخ البغدادي الشهير؛ الفنادق والاستراحات والشقق الجاهزة."
  },
  {
    number: "44",
    nameEn: "Medical Clinics & Agriculture Care",
    nameAr: "المستشفيات والعيادات الطبية والعناية بالنخل",
    descriptionEn: "Medical services; veterinary services; hygienic and beauty care for human beings or animals; agriculture, aquaculture, horticulture and forestry services.",
    descriptionAr: "خدمات المستشفيات والمراكز العلاجية والعيادات السنية والبيطرية؛ العناية بمظهر الإنسان والشعر؛ وخدمات الرصد الحقلي والاعتناء بالنخيل والزراعة."
  },
  {
    number: "45",
    nameEn: "Legal Services & Protection Security",
    nameAr: "الخدمات القانونية والمحاماة والحماية الأمنية",
    descriptionEn: "Legal services; security services for the physical protection of tangible property and individuals; personal and social services rendered by others to meet the needs of individuals.",
    descriptionAr: "مكاتب الحراسة والأمن لحماية الأفراد والأملاك؛ مكاتب المحاماة والاستشارات القانونية بجميع أصنافها وتأسيس الشركات لعامة الناس."
  }
];
