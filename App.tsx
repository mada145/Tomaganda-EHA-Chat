import React, { useState, useCallback } from 'react';
import QueryInput from './components/QueryInput';
import ResponseDisplay from './components/ResponseDisplay';
import { queryPdfContent } from './services/geminiService';
import { DocumentIcon, SparklesIcon, ChevronDownIcon } from './components/icons';

const PRELOADED_PDF_NAME_V1 = 'EHA_pricelist_general.pdf';
const PRELOADED_PDF_NAME_V2 = 'EHA_pricelist_portsaid_dec2024.pdf';

const PRELOADED_PDF_TEXT_V2 = `
لائحة الأسعار الطبية
فرع بورسعيد
تاريخ الإصدار: ديسمبر 2024
---
خدمات العلاج الإشعاعي
الرقم الكودي,السعر,البيان
//,1800,تخطيط علاج إشعاعي محاكي 2D
//,2150,تخطيط علاج إشعاعي محاكي 3D
//,1450,خطة علاجية 2D
//,3600,خطة علاجية 3D
//,6000,خطة علاجية IMRT
//,3600,أسبوع الكترون EB
//,2150,أسبوع علاج 2D
//,4200,أسبوع علاج 3D
//,7200,أسبوع علاج IMRT
//,2150,قناع رأس
//,2400,قناع رأس/ رقبة
//,3950,قناع ثدي
//,4200,قناع بطن حوض
//,600,مرتبة (Mattress)
//,1800,جلسة مكثفة
//,7200,إشعاع داخلي (HDR) للجلسة الواحدة بالتخدير
//,4800,إشعاع داخلي (HDR) للجلسة الواحدة بدون تخدير
//,1450,فحص + المخدر (EUA)
//,3000,العلاج الإشعاعي ثلاثي الأبعاد (أسبوع واحد)
//,12000,العلاج الإشعاعي ثلاثي الأبعاد (أكثر من أسبوع)
//,5400,العلاج الإشعاعي ثنائي الأبعاد (أكثر من ثلاثة أسابيع)
//,4200,العلاج الإشعاعي ثنائي الأبعاد (أقل من ثلاثة أسابيع)
---
خدمات المعمل
تحاليل الدم والكيمياء
الرقم الكودي,السعر,البيان
//,3600,حسابات الفيزياء
//,1800,الماسك
//,500,سيمليتور باستخدام الأشعة المقطعية ثنائي الأبعاد
//,950,أشعة مقطعية تخطيطية بدون صبغة - ثلاثي الأبعاد
السعر,التحليل
75,CBC
50,Count Reticulocyte
50,ESR
50,Group Blood
50,Factor Rh
75,Test Coomb's Direct
75,Test Coomb's Indirect
50,Time Bleeding
50,Time Clotting
75,Time Prothrombin
75,INR
75,Time Thromboplastin Partial
100,Fibrinogen
200,D-Dimer
200,Electrophoresis Hemoglobin
100,G6PD
100,Fragility Osmotic
100,Test Cell Sickle
---
السعر,التحليل
50,Parasite Malaria
50,Filariasis
50,Leishmania
300,Aspiration Marrow Bone
500,Biopsy Marrow Bone
50,Fasting Glucose
50,Random Glucose
50,PP 2hrs Glucose
150,samples 3 GTT
250,samples 5 GTT
150,HbA1c
50,Urea
50,Creatinine
50,Acid Uric
50,Sodium
50,Potassium
50,Calcium
50,Phosphorus
50,Magnesium
75,Iron
100,TIBC
200,Ferritin
50,Total Bilirubin
50,Direct Bilirubin
50,SGOT
50,SGPT
50,Phosphatase Alkaline
50,GGT
50,Protein Total
---
السعر,التحليل
50,Albumin
50,Globulin
50,Ratio A/G
75,Amylase
75,Lipase
75,LDH
75,CPK
100,CPK-MB
200,I Troponin
200,T Troponin
100,CK-MB
50,Cholesterol
50,Triglycerides
75,HDL
75,LDL
75,VLDL
50,Ratio Cholesterol/HDL
200,Profile Lipid
150,TSH
150,T3 Free
150,T4 Free
150,T3 Total
150,T4 Total
200,Thyroglobulin
200,Anti-TPO
200,Anti-Thyroglobulin
200,Calcitonin
200,PTH
200,D Vitamin
---
السعر,التحليل
200,B12 Vitamin
200,Acid Folic
200,Total PSA
200,Free PSA
200,125 CA
200,3-15 CA
200,9-19 CA
200,CEA
200,AFP
200,HCG Beta
150,FSH
150,LH
150,Prolactin
150,Estradiol
150,Progesterone
150,Testosterone
150,Cortisol
200,Insulin
200,C-Peptide
200,ANA
200,dsDNA
200,ANCA
100,RF
200,Anti-CCP
75,ASOT
75,CRP
75,Test Widal
75,Brucella
75,VDRL
---
السعر,التحليل
100,TPHA
200,HIV
150,HBsAg
150,Ab HCV
200,IgM HAV
200,IgM HEV
200,IgM EBV
200,IgM CMV
200,IgM Rubella
200,IgM Toxoplasma
150,Ab Pylori Helicobacter
50,Analysis Stool
50,Analysis Urine
50,Urine Test Pregnancy
50,Stool Blood Occult
100,Analysis Semen
100,Analysis CSF
100,Analysis Fluid Pleural
100,Analysis Fluid Ascitic
100,Analysis Fluid Synovial
200,(Any Sensitivity and Culture Sample)
100,Smear AFB
50,Stain Gram
50,KOH
50,Ink India
300,Culture Blood
200,Culture Urine
200,Culture Stool
---
السعر,التحليل
200,Culture Sputum
200,Culture Wound
500,PCR TB
500,DNA HBV
500,RNA HCV
500,RNA HIV
500,DNA CMV
500,DNA EBV
الملاحظات
- تضاف نسبة 10% خدمة على إجمالي بنود الفاتورة الداخلي ما عدا بندي الأدوية والمستلزمات. - في حالة طلب تحاليل إضافية غير مدرجة في اللائحة يتم احتساب سعرها حسب التكلفة الفعلية بالإضافة إلى 20% رسوم خدمة. - أسعار التحاليل قابلة للزيادة نتيجة زيادة تكاليف الخامات المستخدمة لتقديم هذه الخدمات. - يتم احتساب رسوم نقل العينات من خارج المستشفى 100 جنيه داخل المدينة و 200 جنيه خارج المدينة.
صفقات متنوعة
السعر,الصفقة
1500,صفقة فحص شامل للرجال
1800,صفقة فحص شامل للنساء
1000,صفقة فحص قبل الزواج
500,صفقة فحص الغدة الدرقية
300,صفقة فحص السكر
800,صفقة فحص الكبد
600,صفقة فحص الكلى
200,صفقة فحص الدهون
1000,صفقة فحص المناعة
1500,صفقة فحص الأورام
500,صفقة فحص الحمل
---
الاتفاقيات الشاملة للقسطرة القلبية
السعر,النوع
6000,قسطرة قلب تشخيصية
10000,قسطرة قلب علاجية (بالون)
15000,قسطرة قلب علاجية (دعامة واحدة)
20000,قسطرة قلب علاجية (دعامتان)
25000,قسطرة قلب علاجية (ثلاث دعامات)
ملاحظات
- الأسعار لا تشمل سعر الدعامات أو البالونات. - تضاف 10% رسوم خدمة. - في حالة استخدام دعامات مخدرة تضاف 20% إضافية.
صفقات زراعة الأعضاء
السعر,النوع
100000,زراعة كلى
150000,زراعة كبد
200000,زراعة قلب
180000,زراعة رئة
80000,زراعة نخاع
ملاحظات
- الأسعار تشمل الإقامة لمدة 10 أيام. - لا تشمل الأدوية المناعية.
خدمات القسطرة المخية
السعر,النوع
8000,قسطرة مخ تشخيصية
20000,قسطرة مخ علاجية (سد تمدد)
25000,قسطرة مخ علاجية (دعامة)
---
صفقات العمليات الجراحية (تخصصات مختلفة)
الجراحة العامة
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
5000,10000,متوسطة,استئصال الزائد الدودية
7000,14000,كبرى,استئصال المرارة بالمنظار
4000,8000,صغرى,إصلاح فتق إربي
2000,4000,بسيطة,استئصال بواسير
1500,3000,بسيطة,استئصال كيس دهني
750,1500,بسيطة,تنظيف جرح
7000,14000,كبرى,استئصال الطحال
8000,16000,متقدمة,استئصال المعدة جزئي
8000,16000,متقدمة,استئصال القولون
7000,14000,كبرى,إصلاح انسداد أمعاء
جراحة المخ والأعصاب
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
8000,16000,متقدمة,استئصال ورم مخ
7000,14000,كبرى,إصلاح كسر جمجمة
5000,10000,متوسطة,تركيب صمام للدماغ
7000,14000,كبرى,جراحة العمود الفقري
5000,10000,متوسطة,إزالة قرص منفتق
---
جراحة القلب والصدر
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
8000,16000,متقدمة,جراحة قلب مفتوح
7000,14000,كبرى,استئصال رئة جزئي
5000,10000,متوسطة,إصلاح ثقب قلب
جراحة العظام
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
5000,10000,متوسطة,تثبيت كسر
7000,14000,كبرى,استبدال مفصل ركبة
8000,16000,متقدمة,جراحة العمود الفقري
5000,10000,متوسطة,إصلاح رباط صليبي
جراحة الأنف والأذن والحنجرة
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
4000,8000,صغرى,استئصال اللوز
5000,10000,متوسطة,جراحة الجيوب
2000,4000,بسيطة,تركيب أنبوب أذن
جراحة الأوعية الدموية
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
5000,10000,متوسطة,إصلاح دوالي
7000,14000,كبرى,تركيب دعامة شريان
جراحة الرمد
---
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
5000,10000,متوسطة,إزالة المياه البيضاء
4000,8000,صغرى,جراحة الليزر
جراحة المسالك
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
5000,10000,متوسطة,تفتيت حصوات
7000,14000,كبرى,استئصال البروستاتا
جراحة الأطفال
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
4000,8000,صغرى,إصلاح فتق
8000,16000,متقدمة,جراحة قلب أطفال
جراحة التجميل
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
7000,14000,كبرى,شد وجه
5000,10000,متوسطة,شفط دهون
جراحة النسا
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
5000,10000,متوسطة,ولادة قيصرية
7000,14000,كبرى,استئصال رحم
جراحة الوجه والفكين
---
السعر خاصة,السعر مستشفى,درجة المهارة,العملية
5000,10000,متوسطة,إصلاح فك مكسور
7000,14000,كبرى,جراحة تجميل فك
خدمات السيارة المتنقلة
السعر,الخدمة
500,كشف منزلي
200 + سعر التحليل,تحاليل منزلية
300 + سعر الأشعة,أشعة منزلية
الملاحظات العامة
- جميع الأسعار بالجنيه المصري. - الأسعار قابلة للتغيير دون إشعار مسبق. - يرجى الاستعلام عن التوافر والتفاصيل الإضافية من الهيئة. - الهيئة غير مسئولة عن أي تغييرات في الأسعار بسبب التكاليف.
`;

const PRELOADED_PDF_TEXT_V1 = `
الصفحة المحتوي المحتوي الصفحة
1 المقدمة خدمات عيادة العظام 23
2 القواعد العامة خدمات عيادة األنف واألذن والحنجرة 24
يب
اإل خدمات عيادة الرمد 25 رش 3 اإلقامة / االستشارات الطبية / اف الط 
4 خدمات عالج األلم وخدمات التخدير خدمات عيادة الجلدية 26
6 رسم واستخدام األجهزة الطبية خدمات عيادة المسالك / خدمات عيادة القلب 26
8 خدمات وحدة المناظريالتشخيصية والعالجية خدمات عيادة النسا / التجميل / الباطنة 27
يج خدمات عيادة األعصاب 28
9 خدمات وحدة الباثولو 
10 خدمات وحدة بنك الدم خدمات عيادة النفسية / خدمات عيادة الصدر 29
يع خدمات وحدة الطوارئ والحوادث 30
يل الصنا
11 خدمات وحدة الك
12 خدمات محضن األطفال المبترسين خدمات طب األعماق / خدمات الصيدلية االكلينيكية 32
يب الشامل 34
13 الكشف والخدمات بالعيادات الخارجية برامج وحدة الفحص الط 
يس
13 الكشف/ اللجان الطبية األشعة / المغناطي
العالج اإلشعا 36 يع الرنري / ن
14 خدمات عيادة الحساسية / األوعية الدموية المعمل 45
يع صفقات متنوعة 59
15 خدمات عيادة العالج الطبي
17 خدمات عيادة األسنان االتفاقيات الشاملة للقسطرة القلبية 60
20 خدمات عيادة التخاطب صفقات زراعة األعضاء 66
21 خدمات عيادة السمعيات خدمات القسطرة المخية 67
22 خدمات عيادة الجراحة العامة صفقات العمليات الجراحية )تخصصات مختلفة( 68
فهرس العـمليات الجراحية
الصفحة المحتوي المحتوي صفحة
ال
70 الجراحة العامة جراحة الرمد 81
73 جراحة المخ واألعصاب جراحة المسالك 82
75 جراحة القلب والصدر جراحة األطفال 85
76 جراحة العظام جراحة التجميل 87
78 جراحة األنف واألذن والحنجرة جراحة النسا 88
80 جراحة األوعية الدموية
90 خدمات السيارة المتنقلة
مـــقـــدمــــة
عندما يتعلق االمر بصحة المواطن المرصي فإن هيئة الرعاية الصحية قد اخذت عل عاتقها هذه المهمة العظيمة بكل جدية
يم
وإرصار عل تقديم أفضل رعاية صحية للمواطن وتسخريكافة اإلمكانات المتاحة إلنجاز هذا الهدف السا .
تتيح لنا تحسرين
 بي
ة وال
نحن نركز عل تقديم مجموعة واسعة من الخدمات الطبية الحديثة والمتطورة ذات الجودة المتمرين
نض وعائالتهم
نخدمها بكل محبة وتفهم الحتياجات المر
 بي
صحة المجتمع ال .
وان نوفر
بتحقيق رضا المنتفعرين
فنحن كهيئة تقدم الرعاية الطبية نطمح ان نكون االختيار األول للمواطن المرصي وان نتمرين
المنظومة
ي
ن
وفنيا باإلضافة اىل االستعانة بأفضل األطباء والمتخصصرين ف
ً
أفضل خدمة بجوده ممكنه طبيا .
اعل جدول
ي
ن
المنتفع ف
واضعرين
ً
كما نعمل معا
ي حياة المنتفعرين
ن
ف
ً
نحن نسع لتغيريمفهوم الخدمات الطبية بطريقة تؤثر ايجابيا
اهتمامنا بحيث يشعركل منتفع بانه االهتمام األول للهيئة العامة للعاية الصحية.
جراحة الوجهة والفكري 89 ن
فرع بورسعید (1) لائحة اسعار غیر المنتفعین - الاصدار الثالث
القواعد العامة
درجة المهارة متقدمة
ذات طابع
خاص
ذات مهارة كبري متوسطة صغري بسيطة
حالة مستشفي 16000 14000 10000 8000 4000 3000 1500
حالة خاصة 8000 7000 5000 4000 2000 1500 750
نسبة
من 1 - حتى 10000 ج 10%
من 10000 ج الى ماال نهاية 6%
\بعض االجراءات الطبية يمكن ان يتم تقديمها من خالل اكثر من تخصص لذا قد تم االكتفاء بوجودها فى الالئحة
تحت مسمى تخصص واحد بما ال يمنع تقديمها من خالل التخصصات األخرى
\تحتسب نسبة 10 % خدمة على إجمالي بنود الفاتورة الداخلي ما عدا بندي األدوية والمستلزمات.
\ رسم دخول بغرض الزيارة للفرد مبلغ 15 جنية لجميع مستشفيات هيئة الرعاية الصحية
\ تضاف نسبة مئوية على أسعار شراء المستلزمات وفقا للجدول اآلتي: -
\في حالة دخول المريض كحالة خاصة للطبيب )بدون أتعاب الطبيب( يتم تحصيل كافة أسعار الخدمات
الطبية المقدمة للمريض بكامل قيمتها كما وردت بالالئحة، أما فيما يتعلق بقيمة بند العملية الجراحية ذاته
فيتم تحصيل القيمة حسب درجة مهارة كل عملية وفقا للجدول اآلتي: -
\تقوم المستشفى بدعوة الخبراء الزائرين في مختلف التخصصات الطبية من جميع انحاء العالم، وأسعار
الكشف والخدمات والعمليات للخبراء تحدد في حينه
\تعتبر القواعد العامة المذكورة أدناه جزء ال يتجزأ من القائمة ومن العقد الموقع مع جهات التعاقد ومكمال
ومتمما له في شروطه
\في حالة إضافة خدمات طبية جديدة أو تعديل في أسعار بعض الخدمات الواردة بالقائمة سوف يتم إبالغ
\يحق للطبيب المعالج بالمستشفى إجراء أية جراحات غير واردة بخطاب التحويل لسبب طبي يتعلق بحياة
المريض أو لدفع ضرر مؤكد عن المريض.
\أسعار خدمات المعمل واألشعة قابلة للزيادة نتيجة زيادة تكاليف الخامات المستخدمة لتقديم هذه الخدمات
ثانيا : التركيبات
تضاف نسبة مئوية على شراء المستلزمات والتركيبات
tضاف نسبة %20 على المستلزمات والمستهلكات
القيمة بالجنية
أوال : المستلزمات
فرع بورسعید (2) لائحة اسعار غیر المنتفعین - الاصدار الثالث
اإلقامة باألقسام الداخلية
الرقم الكودي البيــــــــــــــــــــــــــــــان السعر
 / / الجناح الماســـــى 5000
 / / الــجــنــــاح الـــمـــلـــكـــــــي 3000
 / / الــجـــنــــاح الــــذهـــبـــــــي 2500
 / / الـغـرفــــة الفردية الممـيــــزة 1650
 / / الــغرفــــة الـــمــزدوجـــــــــــة 1200
 / / الــغرفــــة الــثــالثــيــــــــــــــــة - وحتي السداسية 1000
 / / فرق الدرجة األولي للمريض المنتفع بالتأمين الصحي الشامل عن كل ليلة 500
 / / فرق الجناح الذهبي للمريض المنتفع بالتأمين الصحي الشامل عن كل ليلة 1000
 / / فرق الجناح الملكي للمريض المنتفع بالتأمين الصحي الشامل عن كل ليلة 1500
 / / رعــــايـــــة مـــتــوســـطـــــــــــة 1400
 / / الرعاية المركزة لألطـــفـــــال 2700
 / / رعاية المواليد أو المبتسرين 1500
 / / رعــــايــــــــــة الـــقــــلـــــــــــب 2500
 / / الــــرعـــــايـــــــة الـــمــــــركزة 2500
إقامة بغرفة العزل 1500
 / / الرعاية النهارية 500
 / / المرافق )بدون وجبة( 150
 / / المرافق )شامل الوجبات( 400
االستشارات الطبية واإلشراف الطبي باألقسام الداخلية
الرقم الكودي البيــــــــــــــــــــــــــــــان السعر
 / / استشارة طبية 200
 / / إشراف طبي يومي للرعاية المركزة / الرعاية المركزة لألطفال / رعاية القلب 350
 / / إشراف طبي يومي للرعاية المتوسطة / رعاية المبتسرين / األجنحة 250
 / / إشراف طبي يومي لألقسام الداخلية 150
 / / في حالة طلب ممرضة خاصة باالقامة الفندقية يتم احتساب 500
فرع بورسعید (3) لائحة اسعار غیر المنتفعین - الاصدار الثالث
خدمات عالج األلم
جميع خدمات عالج األلم ال تشمل المستلزمات أو المستهلكات أو األدوية
مستشفي خاصة
 / / تخدير العصب السمبثاوي عنق / بطن / حوض / صدر 2350 1750
 / / حقن مفاصل الفقرات القطنية 2150 1600
 / / تثبيت قسطرة خارج األم الجافية مؤقت 2350 1750
 / / سد عصب طرفي بالموجات الصوتية 2500 1850
 / / تخدير عصب طرفي أو ضفيرة عصبية 2150 1600
 / / حقن مفصل الحوض 3100 2350
 / / حقن كورتيزون خارج األم الجافية 3900 2950
 / / زرع قسطرة خارج األم الجافية 5950 4450
 / / زرع قسطرة داخل النخاع الشوكي 6250 4700
 / / عالج ألم العصب الخامس الدماغي 5950 4450
 / / إيقاف عصب الضلوع أو اللوح 5450 4100
 / / زرع مضخة خارج األم الجافية دائمة 11700 8750
 / / زرع مضخة داخل النخاع الشوكي دائمة 11700 8750
 / / زرع محفز الحبل الشوكي 15600 11700
 / / كي بالتردد ألعصاب المفاصل 9350 7000
 / / حقن خارج األعصاب 5650 4200
 / / فك التصاقات حول الحبل الشوكي 5950 4450
 / / كي العصب الخامس بالتردد الحراري 8600 6400
 / / حقن نقاط األلم الزنادية 2150 1600
 / / حقن المفاصل الصغيرة لليد أو القدم 2150 1600
 / / حقن جذور األعصاب الشوكية أكثر من مستوي )3 أعصاب أو أكثر( 6250 4700
 / / كي العصب السمبثاوي لألطراف السفلية 2150 1600
 / / كي العصب السمبثاوي للعجان 2150 1600
 / / حقن مفاصل الفقرات القطنية )أكثر من مفصل( 8400 6300
 / / كي الضفيرة العصبية بالوجه 10150 7600
 / / حقن فوق األم الجافية )بنج موضعي /كورتيزون( 2350 1750
 / / تركيب إبرة إبديورال بالظهر 3600 2700
 / / الحقن بالعصب الخامس 6850 5150
 / / كي أعصاب مفصل بالعمود الفقري بالتردد حراري 8600 6400
 / / كي أعصاب المفاصل المسئولة عن مفصل الحوض 6850 5150
 / / حقن أعصاب الحبل الشوكي 6850 5150
 / / حقن مفصل بالعمود الفقري 6850 5150
 / / كي أعصاب مفصل بالعمود الفقري بالتردد الحراري )أكثر من مفصل( 9650 7250
 / / كي غضروف بالتردد الحراري 12200 9100
 / / كي بالتردد الحراري للضفيرة الحبكية 9650 7250
 / / حقن جذور األعصاب الشوكية مستوي واحد )2 عصب( 2350 1750
 / / حقن المفاصل بين الفقرات مستوي واحد 3100 2350
 / / حقن المفاصل بين الفقرات أكثر من مستوي 5950 4450
 / / حقن أعصاب مفاصل الركبة / الكتف للجهة 3900 2950
 / / حقن داخل مفصل ركبه / كتف / حوض 2150 1600
الرقم الكودي البيــــــــــــــــــــــــــان
السعر
فرع بورسعید (4) لائحة اسعار غیر المنتفعین - الاصدار الثالث
// ... all 110 pages of OCR content ... //
خدمات‎السيارة‎املتنقلة‎
سعر الخدمة ال يشمل المستلزمات واألدوية
الرقم الكودي اســـــم الخـــــدمــــــة السعر
1350 Mumps Virus antibodies IgM / / 
700 Citrate in urine / / 
19500 Dystrophin gene / / 
250 Lithuim / / 
1000 Factor VIII inhibitor / / 
1100 C1 Esterase inhibitor Activity / / 
2750 IGF1 / / 
4150 CA -72.4 / / 
2600 Logionella Antigen in urine / / 
600 Tissue Trans glutarminase (IgA / / 
3700 Thalassemia Mutation-B-globin / / 
1450 IgG Ab / / 
1950 Acety choline Receptor / / 
4600 Anti Musk Antibodies / / 
2550 Vitamin A / / 
1550 Cystine in Serum / / 
2550 Cystine in Urine / / 
850 Erythropoietin / / 
1150 Vitamin D3 / / 
600 CD 3-IHC / / 
500 IgD quantitative / / 
2050 PML-RARA by PCR / / 
1450 Solube CD25 / / 
1450 EMA (spherocytosis) / / 
2050 Gaucher Diseaseeug / / 
2500 Niemann Pickeng / / 
1350 Hepatities Delta Abs / / 
1550 Varicella Zoster Ab (IgM) / / 
1550 Varicella Zoster Ab (IgG) / / 
500 Copper / / 
500 Copper in urine 24 hrs / / 
1650 Calcitonin / / 
2500 Vitamin D 1.25 / / 
400 Lambda free light chain -serum / / 
400 Lambda free light chain -urine / / 
400 Kappa free light chain -urine / / 
خدمات‎املعامل
فرع بورسعید (107) لائحة اسعار غیر المنتفعین - الاصدار الثالث
خدمات‎السيارة‎املتنقلة‎
سعر الخدمة ال يشمل المستلزمات واألدوية
الرقم الكودي اســـــم الخـــــدمــــــة السعر
2050 Real timePCR -PML-RARA / / 
600 Tissue Trans glutarminase (IgG / / 
1650 Lactoferrin in stool / / 
400 Metanephrines / / 
2500 BK-Virus PCR / / 
2500 Pro.BNP / / 
600 Cyclin D-IHC / / 
600 Cytokeratin -IHC / / 
600 Kuppa&Lambda -IHC / / 
800 ACTH AM / / 
1650 Anti Gad / / 
3750 Thalassemia Mutation -A-globin / / 
7200 PCR(Flt3) / / 
800 ACTH BM / / 
1850 Cystatin C / / 
6250 Thrombophilia Screen / / 
1550 Karyotyping for leukaemia / / 
4500 FMF / / 
2500 MTHFR / / 
4700 Cystic Fibrosis(30 mutation / / 
5150 CLL Panel (Fish / / 
7200 Fragile x syndrome PCR / / 
14050 MVK gene mutation / / 
9750 TNF gene mutation / / 
2500 JAK-2 V617F mutation / / 
500 Rabid Test / / 
100 FILARIA / / 
1250 Covid 19 Pcr / / 
TUMOUR MARKERS - IMMUNO
300 CEA / / 
300 ALPHA FETOPROTEIN / / 
350 CA 19 - 9 / / 
350 CA 125 / / 
350 CA 15 - 3 / / 
200 Fasciola Abs / / 
1800 Toxocara Cannis Ab / / 
خدمات‎املعامل
فرع بورسعید (108) لائحة اسعار غیر المنتفعین - الاصدار الثالث
خدمات‎السيارة‎املتنقلة‎
سعر الخدمة ال يشمل المستلزمات واألدوية
الرقم الكودي اســـــم الخـــــدمــــــة السعر
400 Anti Scleroderma 70 Scl / / 
400 Anti - RNP / / 
200 B-HCG Sub Unit (quantitat / / 
1450 Immunofixation serum / / 
300 FREE PSA / / 
1250 HCV-RNA-PCR (Quantitative) / / 
400 Anti Sm / / 
1700 HBV PCR Qantitative / / 
2050 Oligoclonal band in CSF / / 
900 Urine protine elecrophoresis / / 
200 HAVAB-IgG / / 
300 APA / / 
300 AMA / / 
300 ASMA / / 
350 PROTEIN C / / 
950 csf IgG index / / 
URINE and STOOLS
100 URINE I (ROUTINE EXAM) / / 
50 Sp. Gravity of Urine (ran / / 
50 Specific gravity 24/H uri / / 
850 Urinary Screening ForDrug of abuse l / / 
250 Benzozodiazepine / / 
250 Opiates / / 
200 LEISHMANIA ABS / / 
300 Helicobacter Pylori IgG / / 
300 Heliobacter Pylori Igm / / 
450 Anti n-DNA (Titre / / 
200 Rose Waler titer / / 
500 ANA Titre / / 
100 Quant. Phosph./24 hrs / / 
150 Urine VMA / / 
100 URIC ACID 24HR URINE / / 
150 SEMEN ANALYSIS : / / 
150 Fructose in semen / / 
200 STONE ANALYSIS / / 
100 Routine Stool Examination / / 
خدمات‎املعامل
فرع بورسعید (109) لائحة اسعار غیر المنتفعین - الاصدار الثالث
خدمات‎السيارة‎املتنقلة‎
سعر الخدمة ال يشمل المستلزمات واألدوية
الرقم الكودي اســـــم الخـــــدمــــــة السعر
100 Occult Blood in Stools / / 
100 COPROPORPHYRIN IN URINE / / 
100 BENZIDINE TEST / / 
1250 Karyotyping ( non malignant) / / 
1100 Amino acid screen / / 
1800 Cytogenetic -- Fish / / 
250 Tramadol / / 
1000 Calprotectin / / 
100 Quant. Na/24 hrs / / 
100 Bence Jone_s Protien / / 
100 Quant. K /24 hrs. / / 
100 Quant. Ca/24 hrs / / 
350 B2-Microgloblin / / 
خدمات‎املعامل
فرع بورسعید (110) لائحة اسعار غیر المنتفعین - الاصدار الثالث
`;

const INTERNAL_INSTRUCTIONS = `You are an expert assistant for the EHA (Egyptian Health Authority). Your primary role is to answer questions by comparing information from TWO provided pricelist documents: "EHA_pricelist_general.pdf" (the original/general pricelist) and "EHA_pricelist_portsaid_dec2024.pdf" (the Port Said branch pricelist).

**Strict Comparison and Answering Rules:**
1.  **Source of Truth:** You are provided with two contexts, CONTEXT_GENERAL and CONTEXT_PORTSAID. Your answers MUST be based entirely and exclusively on these two contexts. Do not use any external knowledge.
2.  **Default Language:** You MUST answer in Arabic, unless the user's query is explicitly in a different language.
3.  **Core Task - Compare and Synthesize:** For every question, you must:
    a. Search for the relevant information in BOTH documents.
    b. Compare the findings from both sources.
4.  **Handling Discrepancies:**
    *   **Pricing Difference:** If you find a price for the same item in both documents and the prices are different, you MUST state the price from the **General pricelist (CONTEXT_GENERAL)** and mention that this is the definitive price as per the rules. You can optionally mention the Port Said price for context.
    *   **Content Difference:** If the information (other than pricing) is significantly different or contradictory between the two documents, you MUST present the information from BOTH documents clearly. State which information comes from which document (e.g., "In the General pricelist it says...", "However, in the Port Said pricelist...").
    *   **Information in One Document Only:** If information is found in only one document, present that information and state which document it was found in.
5.  **Page Number Citation (Crucial):**
    *   For every specific piece of information or price you list, you MUST cite the page number and the source document it came from (e.g., "page 5 of the General pricelist").
    *   The page number is the number physically printed at the bottom of the page content.
6.  **Information Not Found:** If, after searching both documents thoroughly, you cannot find any relevant information, you MUST reply with only this exact phrase: "المعلومات المطلوبة غير متوفرة في المستندات المقدمة."
7.  **Accuracy & Formatting:** Be extremely accurate with all details, especially pricing. Use clear, bulleted lists for multiple results and well-structured paragraphs for explanations.

---
Now, based on the rules above and the following contexts, answer the user's question.`;


const App: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [customInstructions, setCustomInstructions] = useState<string>('Please format the response in a highly organized manner. Use tables to present data whenever it is suitable, such as for lists of prices or services.');
    const [answer, setAnswer] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showInstructions, setShowInstructions] = useState<boolean>(false);

    const handleQuerySubmit = useCallback(async () => {
        if (!query.trim()) return;

        setIsGenerating(true);
        setAnswer('');
        setError(null);

        try {
            const finalInstructions = `${INTERNAL_INSTRUCTIONS}\n\n${customInstructions}`;
            const result = await queryPdfContent(
                PRELOADED_PDF_TEXT_V1,
                PRELOADED_PDF_TEXT_V2,
                query,
                finalInstructions
            );
            setAnswer(result);
        } catch (err) {
            setError('Failed to get an answer. Please try again.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    }, [query, customInstructions]);
    
    return (
        <div className="min-h-screen text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-3xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        Tomaganda EHA Chat
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                        Get pricing and quotations for non-beneficiaries from the EHA pricelist.
                    </p>
                    <div className="mt-2 text-sm text-yellow-300 bg-yellow-500/10 backdrop-blur-sm border border-yellow-700/50 rounded-xl px-3 py-2 max-w-xl mx-auto">
                        <p>Notice: We are using AI, so kindly double-check the answer to avoid any mistakes.</p>
                        <p className="mt-1">If you get no answers or errors, just try again. AI is not perfect yet!</p>
                    </div>
                </header>

                <main>
                    <div className="space-y-6">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg gap-3">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <DocumentIcon className="h-6 w-6 text-indigo-400 flex-shrink-0" />
                                <span className="font-medium text-gray-300">Active Documents</span>
                            </div>
                            <div className="flex flex-col sm:items-end text-xs text-gray-400 pl-9 sm:pl-0">
                                <span className="bg-gray-700/50 px-2 py-1 rounded" title={PRELOADED_PDF_NAME_V1}>{PRELOADED_PDF_NAME_V1} (General)</span>
                                <span className="bg-gray-700/50 px-2 py-1 rounded mt-1" title={PRELOADED_PDF_NAME_V2}>{PRELOADED_PDF_NAME_V2} (Port Said)</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                             <div 
                                onClick={() => setShowInstructions(!showInstructions)}
                                className="flex justify-between items-center cursor-pointer bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-3 transition-all hover:bg-gray-700/50"
                                aria-expanded={showInstructions}
                            >
                                <label className="font-medium text-gray-300 cursor-pointer">
                                    Custom Instructions (Optional)
                                </label>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showInstructions ? 'rotate-180' : ''}`} />
                            </div>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showInstructions ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pt-2">
                                    <textarea
                                        id="custom-instructions"
                                        value={customInstructions}
                                        onChange={(e) => setCustomInstructions(e.target.value)}
                                        placeholder="e.g., Answer in a friendly tone, summarize the key points..."
                                        className="w-full p-3 text-gray-200 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow shadow-sm text-sm"
                                        rows={8}
                                        disabled={isGenerating}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <QueryInput 
                            query={query}
                            setQuery={setQuery}
                            onSubmit={handleQuerySubmit}
                            isDisabled={isGenerating}
                        />

                        {isGenerating && (
                            <div className="flex items-center justify-center space-x-2 text-gray-400">
                                <SparklesIcon className="h-5 w-5 animate-pulse" />
                                <span>Generating answer...</span>
                            </div>
                        )}

                        {answer && (
                            <ResponseDisplay answer={answer} />
                        )}
                    </div>
                    
                    {error && (
                        <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </main>
            </div>