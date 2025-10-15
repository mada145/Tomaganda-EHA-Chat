import React, { useState, useCallback } from 'react';
import QueryInput from './components/QueryInput';
import ResponseDisplay from './components/ResponseDisplay';
import { queryPdfContent } from './services/geminiService';
import { DocumentIcon, SparklesIcon } from './components/icons';

const PRELOADED_PDF_NAME = 'EHA_pricelist.pdf';

const PRELOADED_PDF_TEXT = `
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
تضاف نسبة %20 على المستلزمات والمستهلكات
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

const defaultInstructions = `أنت مساعد متخصص في الإجابة على الأسئلة المتعلقة بقائمة أسعار هيئة الرعاية الصحية (EHA) بناءً على المستند المرفق فقط.

**قواعد صارمة يجب اتباعها:**
1.  **الرد باللغة العربية:** يجب أن تكون جميع ردودك باللغة العربية، ما لم يطلب المستخدم لغة أخرى بشكل صريح في سؤاله.
2.  **الاعتماد الحصري على المستند:** يجب أن تستند إجاباتك بشكل كامل وحصري إلى "السياق" (CONTEXT) المأخوذ من ملف PDF. لا تستخدم أي معلومات خارجية على الإطلاق.
3.  **الدقة في الأسعار:** الأسعار هي الجزء الأكثر أهمية. كن دقيقًا للغاية عند ذكر أي تكاليف أو أرقام.
4.  **ذكر جميع الحالات ورقم الصفحة:** قد يظهر نفس الإجراء أو الخدمة عدة مرات في المستند. يجب عليك البحث في المستند بأكمله والعثور على جميع الحالات ذات الصلة وذكرها. لكل حالة تذكرها، يجب أن تذكر رقم الصفحة التي وردت فيها.
5.  **التنسيق:** عند العثور على عدة نتائج، قم بإدراجها في قائمة نقطية. مثال للتنسيق:
    - اسم الخدمة - السعر (صفحة X)
    - اسم الخدمة بصيغة مختلفة - السعر (صفحة Y)
6.  **في حال عدم توفر المعلومة:** إذا لم تتمكن من العثور على إجابة في السياق المقدم، يجب أن ترد بـ: "المعلومات المطلوبة غير متوفرة في المستند المقدم."

---
الآن، بناءً على القواعد المذكورة أعلاه والسياق التالي، أجب على السؤال.`;


const App: React.FC = () => {
    const [pdfText] = useState<string>(PRELOADED_PDF_TEXT);
    const [query, setQuery] = useState<string>('');
    const [customInstructions, setCustomInstructions] = useState<string>(defaultInstructions);
    const [answer, setAnswer] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleQuerySubmit = useCallback(async () => {
        if (!query.trim() || !pdfText) return;

        setIsGenerating(true);
        setAnswer('');
        setError(null);

        try {
            const result = await queryPdfContent(pdfText, query, customInstructions);
            setAnswer(result);
        } catch (err) {
            setError('Failed to get an answer. Please try again.');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    }, [query, pdfText, customInstructions]);
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-3xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        Tomaganda EHA Chat
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Get pricing and quotations for non-beneficiaries from the EHA pricelist.
                    </p>
                    <div className="mt-2 text-sm text-yellow-400 bg-yellow-900/30 border border-yellow-700/50 rounded-md px-3 py-2 max-w-xl mx-auto">
                        <p>Notice: We are using AI, so kindly double-check the answer to avoid any mistakes.</p>
                        <p className="mt-1">If you get no answers or errors, just try again. AI is not perfect yet!</p>
                    </div>
                </header>

                <main>
                    <div className="space-y-6">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center shadow-lg">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <DocumentIcon className="h-6 w-6 text-indigo-400 flex-shrink-0" />
                                <span className="font-medium text-gray-300 truncate" title={PRELOADED_PDF_NAME}>{PRELOADED_PDF_NAME}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Default Source</span>
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="custom-instructions" className="block text-sm font-medium text-gray-400">
                                Custom Instructions
                            </label>
                            <textarea
                                id="custom-instructions"
                                value={customInstructions}
                                onChange={(e) => setCustomInstructions(e.target.value)}
                                placeholder="e.g., Answer in a friendly tone, summarize the key points..."
                                className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow shadow-sm text-sm"
                                rows={18}
                                disabled={isGenerating}
                            />
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
            <footer className="text-center mt-auto pt-8 text-gray-500 text-sm">
                <p>© 2025 k8ng’s Domain. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default App;