import React, { useState, useEffect } from 'react';
import { Play, Download, Search, User, LogOut, Star, ShieldCheck, Crown, Tv, Mail, Lock, AlertCircle, CheckCircle, Wallet, MessageCircle, Send, ListVideo } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdiKIHf8WfET-orTEsGtu_59gcOEl7Tlo",
  authDomain: "toontool-13288.firebaseapp.com",
  projectId: "toontool-13288",
  storageBucket: "toontool-13288.firebasestorage.app",
  messagingSenderId: "703104343209",
  appId: "1:703104343209:web:d86dff18da7f4f7000ddb8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// قاعدة بيانات المسلسلات
// ==========================================
const showsData = [
  {
    id: 1,
    title: 'هاي أرنولد!',
    rating: '7.6',
    isVip: true,
    image: 'https://i.postimg.cc/442JpqsY/download.jpg', // بوستر المكتبة
    coverImage: 'https://i.postimg.cc/YCHYwhZp/download-(5).jpg', // صورة الغلاف للشريط العلوي
    tags: ['مدبلج', 'بدون حذف', 'ريماستر'],
    description: 'يوميات أرنولد وأصدقائه في المدينة والمواقف التي يتعرضون لها يومياً.',
    episodes: [
      { id: 1, title: 'فواكه وسط المدينة / دراجة يوجين' },
      { id: 2, title: 'الكتاب الصغير الوردي / رحلة ميدانية' },
      { id: 3, title: 'قبعة أرنولد / الفتى المتنمر' }
    ]
  },
  {
    id: 2,
    title: 'أفاتار: أسطورة أنج',
    rating: '9.3',
    isVip: false,
    image: 'https://i.postimg.cc/nhDcF28T/Avatar-The-Last-Airbender-Animated-Television-Series-24x36-Poster-Print-Check-out-this-great-prod.jpg',
    coverImage: 'https://i.postimg.cc/HnNcKLMq/Avatar-Aang-(Avatar-The-Last-Airbender).jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'يستيقظ أنج بعد 100 عام ليكتشف أنه الأفاتار الذي يجب أن ينقذ العالم من أمة النار.',
    episodes: [
      { id: 1, title: 'الفتى في الجبل الجليدي' },
      { id: 2, title: 'عودة الأفاتار' },
      { id: 3, title: 'معبد الهواء الجنوبي' }
    ]
  },
  {
    id: 3,
    title: 'العرض العادي (Regular Show)',
    rating: '8.5',
    isVip: false,
    image: 'https://i.postimg.cc/h42GphbF/Interview-The-cast-and-crew-of-REGULAR-SHOW-THE.jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'مغامرات موردكاي وريجبي في الحديقة حيث يتحول الروتين اليومي إلى كوارث خارقة للطبيعة.',
    episodes: [
      { id: 1, title: 'القوة' },
      { id: 2, title: 'رتبوا الكراسي' }
    ]
  },
  {
    id: 4,
    title: 'ساموراي جاك',
    rating: '8.5',
    isVip: false,
    image: 'https://i.postimg.cc/gJ0CJcwV/Samurai-Jack-(2001-2017).jpg',
    coverImage: 'https://i.postimg.cc/C5nLRsZC/Samuraj-Dzek.jpg',
    tags: ['مترجم'],
    description: 'أمير محارب يُرسل إلى المستقبل البائس بواسطة الشيطان أكو، ويحارب للعودة لزمنه.',
    episodes: [
      { id: 1, title: 'الحلقة الأولى: البداية' },
      { id: 2, title: 'الساموراي الملقب بجاك' }
    ]
  },
  {
    id: 5,
    title: 'مراهقو التايتنز',
    rating: '7.9',
    isVip: false,
    image: 'https://i.postimg.cc/dVrwP0d4/download-(1).jpg',
    coverImage: 'https://i.postimg.cc/ZKyCn4pB/download-(4).jpg',
    tags: ['مترجم'],
    description: 'خمسة مراهقين أبطال خارقين يعيشون معاً وينقذون العالم من الأشرار.',
    episodes: [
      { id: 1, title: 'فرق تسد' },
      { id: 2, title: 'الأخوات' }
    ]
  },
  {
    id: 6,
    title: 'خلف حائط الحديقة',
    rating: '8.8',
    isVip: false,
    image: 'https://i.postimg.cc/906KJGxH/download-(2).jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'أخوان يضيعان في غابة سحرية ويحاولان إيجاد طريقهما للمنزل.',
    episodes: [
      { id: 1, title: 'الطاحونة القديمة' },
      { id: 2, title: 'أوقات عصيبة' }
    ]
  },
  {
    id: 7,
    title: 'المراهقة الآلية',
    rating: '7.0',
    isVip: false,
    image: 'https://i.postimg.cc/Hnr1SWdQ/images.jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'جيني، روبوت قتالي، تحاول موازنة حياتها كمراهقة عادية مع واجبها في إنقاذ الأرض.',
    episodes: [
      { id: 1, title: 'جارتنا الجديدة' }
    ]
  },
  {
    id: 8,
    title: 'ما الجديد يا سكوبي دو؟',
    rating: '7.2',
    isVip: false,
    image: 'https://i.postimg.cc/rwkFpWqr/What-s-New-Scooby-Doo.jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'سكوبي ورفاقه يعودون بحلة جديدة لحل ألغاز وحوش وأشباح غامضة.',
    episodes: [
      { id: 1, title: 'لا يوجد وحش للجليد' }
    ]
  },
  {
    id: 9,
    title: 'تشاودر',
    rating: '7.3',
    isVip: false,
    image: 'https://i.postimg.cc/pd02k6zw/Chowder-(2007-2010).jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'مغامرات تشاودر الصغير المضحكة وهو يتعلم الطبخ في مطعم مانغ دال.',
    episodes: [
      { id: 1, title: 'كعكة الضفدع' }
    ]
  },
  {
    id: 10,
    title: 'مغامرات فلاب جاك',
    rating: '7.6',
    isVip: false,
    image: 'https://i.postimg.cc/Kzwmh39Q/The-Marvelous-Misadventures-of-Flapjack.jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'فلاب جاك والكابتن كناكلز يبحثان عن جزيرة الحلوى الأسطورية.',
    episodes: [
      { id: 1, title: 'الجزيرة المسروقة' }
    ]
  },
  {
    id: 11,
    title: 'كوردج الجبان',
    rating: '8.3',
    isVip: false,
    image: 'https://i.postimg.cc/SQYy7Vsg/Courage-the-Cowardly-Dog-(1999).jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'كلب جبان جداً يعيش في مزرعة نائية يضطر لمواجهة الوحوش لإنقاذ مالكيه.',
    episodes: [
      { id: 1, title: 'ليلة في نزل كاتز' }
    ]
  },
  {
    id: 12,
    title: 'داني الشبح',
    rating: '7.1',
    isVip: false,
    image: 'https://i.postimg.cc/Jhh8y5vS/Danny-Phantom.jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'مراهق يحصل على قوى أشباح بالخطأ ويستخدمها لمحاربة الأشرار وحماية مدينته.',
    episodes: [
      { id: 1, title: 'اللحم المجهول' }
    ]
  },
  {
    id: 13,
    title: 'إد، إدد وإدي',
    rating: '7.4',
    isVip: false,
    image: 'https://i.postimg.cc/sDRRPrbd/download-(3).jpg',
    tags: ['مدبلج', 'بدون حذف'],
    description: 'ثلاثة أصدقاء يبتكرون خططاً ومقالب غريبة للحصول على المال لشراء الحلوى.',
    episodes: [
      { id: 1, title: 'الإخوة إد' }
    ]
  }
];

// ==========================================
// المكونات (Components)
// ==========================================

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(auth, email);
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        setTimeout(() => setIsForgotPassword(false), 3000);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          plan: 'free', 
          expiresAt: null 
        });
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('هذا البريد الإلكتروني مسجل بالفعل.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      else if (err.code === 'auth/weak-password') setError('كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل.');
      else setError('حدث خطأ، يرجى المحاولة مرة أخرى.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-30"></div>

      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2 tracking-tighter">
            ToonTool
          </h1>
          <p className="text-gray-400">
            {isForgotPassword ? 'استعادة كلمة المرور' : isLogin ? 'تسجيل الدخول للمتابعة' : 'إنشاء حساب جديد'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-xl mb-4 flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="text-sm">{message}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-purple-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-purple-500 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 flex justify-center items-center"
          >
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : (isForgotPassword ? 'إرسال الرابط' : isLogin ? 'دخول' : 'إنشاء الحساب')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {!isForgotPassword && (
            <button onClick={() => setIsForgotPassword(true)} className="text-sm text-gray-400 hover:text-white transition-colors block w-full">
              نسيت كلمة المرور؟
            </button>
          )}
          
          <button 
            onClick={() => {
              setIsForgotPassword(false);
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }} 
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-semibold block w-full"
          >
            {isForgotPassword ? 'العودة لتسجيل الدخول' : isLogin ? 'لا تملك حساباً؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ user, userProfile, setCurrentPage, setSelectedShow }) => (
  <nav className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentPage('home'); setSelectedShow(null); }}>
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Play className="text-white fill-white ml-1" size={20} />
        </div>
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tighter">
          ToonTool
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentPage('subscriptions')}
          className="hidden md:flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-semibold bg-yellow-500/10 px-4 py-2 rounded-full transition-colors border border-yellow-500/20"
        >
          <Crown size={18} /> {userProfile?.plan === 'premium' ? 'مشترك VIP' : 'ترقية الباقة'}
        </button>
        
        <div className="flex items-center gap-3 bg-gray-800 py-1.5 px-3 rounded-full border border-gray-700">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${userProfile?.plan === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-purple-600'}`}>
            {userProfile?.plan === 'premium' ? <Crown className="text-white" size={16} /> : <User className="text-white" size={16} />}
          </div>
          <span className="text-sm font-medium text-gray-300 max-w-[100px] truncate block">
            {user?.email?.split('@')[0]}
          </span>
          <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-red-500 transition-colors mr-2" title="تسجيل الخروج">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const HomePage = ({ setCurrentPage, userProfile, setSelectedShow }) => {
  // اختيار هاي أرنولد (1)، أفاتار (2)، ساموراي جاك (4)، ومراهقو التايتنز (5) للشريط العلوي
  const featuredShows = showsData.filter(show => [1, 2, 4, 5].includes(show.id));
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredShows.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredShows.length]);

  const handleWatchClick = (show) => {
    if (show.isVip && userProfile?.plan !== 'premium') {
      alert("عذراً، هذا المسلسل مخصص للمشتركين في الباقة المدفوعة فقط. قم بالترقية الآن!");
      setCurrentPage('subscriptions');
    } else {
      setSelectedShow(show);
      setCurrentPage('watch');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {userProfile?.plan !== 'premium' && (
        <div className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div>
            <h4 className="text-white font-bold mb-1">إعلان تجاري</h4>
            <p className="text-gray-400 text-sm">اشترك الآن في الباقة المدفوعة واستمتع بمشاهدة بدون إعلانات مزعجة وفتح كل المسلسلات المغلقة.</p>
          </div>
          <button onClick={() => setCurrentPage('subscriptions')} className="mt-4 md:mt-0 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors">
            إزالة الإعلانات
          </button>
        </div>
      )}

      {/* الشريط المتحرك (Carousel) */}
      <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[450px] mb-12 shadow-2xl shadow-purple-900/20 group bg-gray-900">
        {featuredShows.map((show, index) => (
          <div 
            key={show.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent z-10"></div>
            {/* استخدام coverImage للشريط العلوي، وإذا لم تتوفر يستخدم image كبديل */}
            <img src={show.coverImage || show.image} alt={show.title} className="absolute inset-0 w-full h-full object-cover transform scale-105" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 w-full md:w-2/3">
              <div className="flex gap-2 mb-3">
                {show.tags.map((tag, idx) => (
                  <span key={idx} className="bg-purple-600/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">{show.title}</h1>
              <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">{show.description}</p>
              <div className="flex gap-4">
                <button onClick={() => handleWatchClick(show)} className="bg-white text-gray-900 hover:bg-gray-200 font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-transform transform hover:scale-105 shadow-xl">
                  <Play fill="currentColor" size={20} /> شاهد الآن
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* نقاط التنقل (Dots) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {featuredShows.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-purple-500' : 'w-2 bg-gray-400 hover:bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">المكتبة الكاملة</h2>
        <p className="text-gray-400 text-sm">المسلسلات المقفولة باللون الذهبي تتطلب اشتراك مدفوع</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {showsData.map((item) => (
          <div key={item.id} className="group cursor-pointer" onClick={() => handleWatchClick(item)}>
            <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] mb-3 border-2 transition-colors ${item.isVip && userProfile?.plan !== 'premium' ? 'border-gray-700' : 'border-transparent group-hover:border-purple-500/50'}`}>
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
              
              {/* التقييم */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Star className="text-yellow-500 fill-yellow-500" size={12} /> {item.rating}
              </div>

              {/* الشارات (مدبلج/مترجم/بدون حذف) */}
              <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-lg ${tag === 'مترجم' ? 'bg-red-600 text-white' : tag === 'مدبلج' ? 'bg-green-600 text-white' : tag === 'ريماستر' ? 'bg-yellow-500 text-gray-900' : 'bg-blue-600 text-white'}`}>
                    {tag}
                  </span>
                ))}
              </div>

              {item.isVip && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                  <Crown size={12} /> VIP
                </div>
              )}

              {item.isVip && userProfile?.plan !== 'premium' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                   <Lock className="text-yellow-500 drop-shadow-2xl" size={40} />
                </div>
              )}
            </div>
            <h3 className="text-white font-bold text-[15px] group-hover:text-purple-400 transition-colors flex items-center gap-2">
              {item.title} 
              {item.isVip && userProfile?.plan !== 'premium' && <Lock size={14} className="text-gray-500" />}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const WatchPage = ({ setCurrentPage, userProfile, selectedShow }) => {
  const [activeEpisode, setActiveEpisode] = useState(selectedShow.episodes[0]);

  const handleVipServerClick = () => {
    if (userProfile?.plan !== 'premium') {
      alert('هذا المشغل/الرابط مخصص للمشتركين فقط. سرعة مضاعفة وبدون تقطيع!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-bold bg-gray-800 px-4 py-2 rounded-lg transition-colors">
        &larr; العودة للمكتبة
      </button>

      {userProfile?.plan !== 'premium' && (
        <div className="w-full bg-gray-800 border border-gray-700 p-2 text-center text-gray-400 text-sm mb-4 rounded-lg">
          مساحة إعلانية مزعجة - اشترك في باقة ToonTool لحجب الإعلانات وتسريع التحميل
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-gray-800 mb-6 flex items-center justify-center group">
            {/* استخدام الغلاف هنا أيضاً إذا توفر يعطي مظهراً أفضل */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${selectedShow.coverImage || selectedShow.image})` }}></div>
            <div className="relative z-20 w-20 h-20 bg-purple-600/90 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:scale-110 transition-transform backdrop-blur-sm">
              <Play className="text-white fill-white ml-2" size={32} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between text-white border border-gray-700 z-20">
               <span className="font-bold text-sm truncate">{activeEpisode.title}</span>
               <div className="flex gap-2">
                 {selectedShow.tags.map((tag, i) => (
                   <span key={i} className="bg-gray-700 px-2 py-0.5 rounded text-[10px] text-gray-300">{tag}</span>
                 ))}
               </div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">{selectedShow.title}</h1>
          <h2 className="text-xl text-purple-400 font-bold mb-4">الحلقة {activeEpisode.id}: {activeEpisode.title}</h2>
          
          <p className="text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            {selectedShow.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Tv className="text-purple-500" size={20} /> سيرفرات المشاهدة
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={handleVipServerClick}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex justify-between items-center transition-all ${userProfile?.plan === 'premium' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}
                >
                  <span className="flex items-center gap-2"><Crown size={18} /> مشغل VIP الخارق (بدون تقطيع)</span>
                  {userProfile?.plan !== 'premium' && <Lock size={16} />}
                </button>
                <button className="w-full py-3 px-4 rounded-xl font-semibold flex justify-between items-center transition-all bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700">
                  <span>مشغل ToonTool العادي (720p)</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Download className="text-blue-500" size={20} /> روابط التحميل
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={handleVipServerClick}
                  className={`w-full py-3 px-4 rounded-xl font-semibold flex justify-between items-center transition-all ${userProfile?.plan === 'premium' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}
                >
                  <span className="flex items-center gap-2"><Crown size={18} /> تحميل سريع جداً (1080p)</span>
                  {userProfile?.plan !== 'premium' && <Lock size={16} />}
                </button>
                <button className="w-full py-3 px-4 rounded-xl font-semibold flex justify-between items-center transition-all bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700">
                  <span>تحميل مجاني متوسط السرعة (720p)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ListVideo className="text-purple-500" size={20} /> قائمة الحلقات
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {selectedShow.episodes.map((ep) => (
                <button 
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`w-full text-right p-3 rounded-xl transition-all border flex items-center justify-between ${activeEpisode.id === ep.id ? 'bg-purple-600/20 border-purple-500 text-white font-bold' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                >
                  <span className="truncate max-w-[85%]">{ep.id}. {ep.title}</span>
                  {activeEpisode.id === ep.id && <Play fill="currentColor" size={14} className="text-purple-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionsPage = ({ setCurrentPage, user, userProfile }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('vodafone');

  const plans = [
    { 
      id: 'free',
      name: 'الباقة المجانية', 
      priceText: 'مجانًا', 
      popular: false, 
      features: ['مشاهدة بجودة 720p', 'سيرفرات عادية للمشاهدة', 'دعم فني عادي'] 
    },
    { 
      id: 'premium',
      name: 'الباقة المدفوعة', 
      priceUSDT: '4.00', 
      priceEGP: '200', 
      popular: true, 
      features: ['جودة 1080p & 4K', 'سيرفرات VIP خارقة للتحميل والمشاهدة', 'بدون إعلانات نهائياً', 'فتح كل المسلسلات المغلقة (هاي أرنولد وغيره)', 'دعم فني أولوية'] 
    }
  ];

  const VODAFONE_NUMBER = "01064631537";
  const USDT_WALLET = "TUfJJ4ZCUkTR9YxxYHaeyhbPeBAHPDk2fP";
  
  const handleWhatsAppContact = () => {
    const waNumber = "201064631537"; 
    const message = `مرحباً الدعم الفني لـ ToonTool،\nأود تفعيل اشتراك لمدة 30 يوم للباقة المدفوعة.\n- الإيميل: ${user?.email}\n- طريقة الدفع: ${paymentMethod === 'vodafone' ? 'فودافون كاش' : 'USDT TRC20'}\n\nمرفق صورة إيصال التحويل:`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleTelegramContact = () => {
    window.open(`https://t.me/CartoonYbStoreChat_Bot`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-white mb-4">اختر الباقة المناسبة لك</h1>
        <p className="text-gray-400 text-lg">استمتع بتجربة مشاهدة سينمائية خالية من الإعلانات وبأعلى جودة.</p>
      </div>

      {userProfile?.plan === 'premium' && (
        <div className="max-w-4xl mx-auto mb-8 bg-green-500/10 border border-green-500/50 p-4 rounded-xl flex items-center gap-3 text-green-400">
          <Crown size={24} />
          <div>
            <h3 className="font-bold">أنت الآن مشترك في الباقة المدفوعة VIP!</h3>
            <p className="text-sm text-green-200/70">جميع المسلسلات والسيرفرات مفتوحة لك، وبدون إعلانات.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-gray-900/50 backdrop-blur-xl border ${plan.popular ? 'border-purple-500 shadow-2xl shadow-purple-500/20 transform md:-translate-y-4' : 'border-gray-800'} rounded-3xl p-8 flex flex-col`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                الأكثر طلباً
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="flex flex-col gap-1 mb-6">
              {plan.id === 'free' ? (
                <span className="text-4xl font-black text-white">مجانًا</span>
              ) : (
                <>
                  <span className="text-4xl font-black text-white">${plan.priceUSDT} <span className="text-sm text-gray-400">USDT</span></span>
                  <span className="text-lg font-bold text-purple-400">أو {plan.priceEGP} جنيه شهرياً</span>
                </>
              )}
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className={plan.popular ? 'text-purple-500' : 'text-gray-500'} size={18} />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.id === 'free' ? (
              <button disabled className="w-full py-4 rounded-xl font-bold bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700">
                {userProfile?.plan === 'free' ? 'باقتك الحالية' : 'متاحة للجميع'}
              </button>
            ) : (
              <button 
                onClick={() => setSelectedPlan(plan)}
                disabled={userProfile?.plan === 'premium'}
                className={`w-full py-4 rounded-xl font-bold transition-all ${userProfile?.plan === 'premium' ? 'bg-green-600/50 text-green-200 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/25'}`}
              >
                {userProfile?.plan === 'premium' ? 'باقتك الحالية مفعلة' : 'اشترك الآن'}
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-2xl font-bold text-white">تأكيد الاشتراك: {selectedPlan.name}</h3>
              <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-4">اختر طريقة الدفع المناسبة لك:</p>
              
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setPaymentMethod('vodafone')}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'vodafone' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  <Wallet size={18} /> فودافون كاش
                </button>
                <button 
                  onClick={() => setPaymentMethod('usdt')}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${paymentMethod === 'usdt' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  <Crown size={18} /> USDT (TRC20)
                </button>
              </div>

              <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 mb-6">
                {paymentMethod === 'vodafone' ? (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">المبلغ المطلوب للتحويل:</p>
                    <p className="text-2xl font-black text-white mb-4">{selectedPlan.priceEGP} جنيه مصري</p>
                    <p className="text-gray-400 text-sm mb-2">رقم فودافون كاش للتحويل:</p>
                    <div className="bg-gray-900 p-3 rounded-xl text-center text-xl font-mono text-purple-400 tracking-widest select-all">
                      {VODAFONE_NUMBER}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">المبلغ المطلوب للتحويل:</p>
                    <p className="text-2xl font-black text-white mb-4">{selectedPlan.priceUSDT} USDT</p>
                    <p className="text-gray-400 text-sm mb-2">عنوان محفظة TRC20:</p>
                    <div className="bg-gray-900 p-3 rounded-xl text-center text-sm font-mono text-green-400 break-all select-all">
                      {USDT_WALLET}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-6">
                <p className="text-sm text-blue-200 leading-relaxed">
                  <strong>خطوات التفعيل:</strong> قم بتحويل المبلغ أعلاه، ثم التقط صورة لإيصال التحويل، واضغط على أحد الأزرار بالأسفل لإرسالها للدعم الفني لتفعيل حسابك فوراً لمدة 30 يوم.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleWhatsAppContact}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} /> تواصل عبر واتساب
                </button>
                <button 
                  onClick={handleTelegramContact}
                  className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={20} /> تواصل عبر تليجرام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-12">
        <button onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white transition-colors font-bold">
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            let data = docSnap.data();
            if (data.plan === 'premium' && data.expiresAt) {
              const expiryDate = new Date(data.expiresAt).getTime(); 
              if (Date.now() > expiryDate) {
                data.plan = 'free';
                await updateDoc(docRef, { plan: 'free', expiresAt: null });
              }
            }
            setUserProfile(data);
          }
        } catch (err) {
          console.error("خطأ في جلب بيانات المستخدم:", err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-12" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar setCurrentPage={setCurrentPage} setSelectedShow={setSelectedShow} user={user} userProfile={userProfile} />
      
      <main>
        {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} setSelectedShow={setSelectedShow} userProfile={userProfile} />}
        {currentPage === 'watch' && selectedShow && <WatchPage setCurrentPage={setCurrentPage} userProfile={userProfile} selectedShow={selectedShow} />}
        {currentPage === 'subscriptions' && <SubscriptionsPage setCurrentPage={setCurrentPage} user={user} userProfile={userProfile} />}
      </main>
    </div>
  );
};

export default App;