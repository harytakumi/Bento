/* Dataset makanan sehat, camilan sesekali, kebersihan, teman hewan, dan stiker Bento Ceria! */
import type { AnimalFriend, BentoSlotKey, FoodItem, HygienePair, StickerItem } from '../types';

export const FOOD_ITEMS: FoodItem[] = [
  // Karbohidrat (Makanan Super)
  {
    id: 'nasi',
    name: 'Nasi Putih',
    emoji: '🍚',
    category: 'karbohidrat',
    health_status: 'makanan_super',
    color: 'putih',
    kid_benefit: 'Nasi putih memberi tenaga supaya kamu semangat bermain sepanjang hari!',
    riddle_clues: 'Warnaku putih bersih, butiranku kecil dan hangat di piring. Aku bikin badanmu bertenaga untuk lari dan bermain!',
    riddle_fact: 'Hebat! Nasi Putih adalah sumber tenaga utama yang bikin kita kuat bermain.',
  },
  {
    id: 'roti_gandum',
    name: 'Roti Gandum',
    emoji: '🍞',
    category: 'karbohidrat',
    health_status: 'makanan_super',
    color: 'cokelat muda',
    kid_benefit: 'Roti gandum kaya serat baik supaya perutmu nyaman dan kenyang lebih lama!',
    riddle_clues: 'Warnaku cokelat muda dan bentukku empuk kotak-kotak. Aku enak dimakan saat sarapan pagi supaya kuat belajar!',
    riddle_fact: 'Benar! Roti Gandum bikin perut kenyang lebih lama dan penuh serat.',
  },
  {
    id: 'jagung',
    name: 'Jagung Rebus',
    emoji: '🌽',
    category: 'karbohidrat',
    health_status: 'makanan_super',
    color: 'kuning',
    kid_benefit: 'Jagung manis punya banyak vitamin dan bikin mata serta tenagamu tetap oke!',
    riddle_clues: 'Warnaku kuning cerah dengan biji kecil berbaris rapi seperti mutiara. Rasaku manis alami dan bikin tubuh bertenaga!',
    riddle_fact: 'Pintar! Jagung Rebus punya biji manis yang menyehatkan mata dan tubuh.',
  },
  {
    id: 'kentang_rebus',
    name: 'Kentang Rebus',
    emoji: '🥔',
    category: 'karbohidrat',
    health_status: 'makanan_super',
    color: 'cokelat keemasan',
    kid_benefit: 'Kentang rebus lembut di perut dan memberi energi sehat tanpa banyak minyak!',
    riddle_clues: 'Bentukku bulat lonjong dari dalam tanah dan teksturnya empuk saat direbus. Aku memberi energi hebat untuk tubuhmu!',
    riddle_fact: 'Keren! Kentang Rebus lembut di perut dan kaya energi baik.',
  },

  // Lauk Protein (Makanan Super)
  {
    id: 'ayam_panggang',
    name: 'Ayam Panggang',
    emoji: '🍗',
    category: 'protein',
    health_status: 'makanan_super',
    color: 'cokelat keemasan',
    kid_benefit: 'Ayam panggang penuh protein supaya ototmu tumbuh kuat dan tinggi!',
    riddle_clues: 'Warnaku cokelat keemasan dan wangiku gurih sekali. Aku membantu otot tangan dan kakimu tumbuh kuat!',
    riddle_fact: 'Mantap! Ayam Panggang kaya protein untuk membangun otot yang kuat.',
  },
  {
    id: 'telur_rebus',
    name: 'Telur Rebus',
    emoji: '🥚',
    category: 'protein',
    health_status: 'makanan_super',
    color: 'putih dan kuning',
    kid_benefit: 'Telur rebus membantu otakmu makin pintar dan badanmu tumbuh tinggi!',
    riddle_clues: 'Bentukku lonjong putih di luar, dan kuning bulat di dalam. Aku bikin otakmu cerdas dan badanmu kuat!',
    riddle_fact: 'Jempolan! Telur Rebus sangat bagus untuk otak cerdas dan tulang kuat.',
  },
  {
    id: 'ikan_kukus',
    name: 'Ikan Kukus',
    emoji: '🐟',
    category: 'protein',
    health_status: 'makanan_super',
    color: 'perak biru',
    kid_benefit: 'Ikan kukus punya gizi hebat yang bikin otakmu cerdas dan mata sehat!',
    riddle_clues: 'Aku suka berenang di air dan punya sirip. Makan aku bikin otakmu makin pintar dan mata jernih!',
    riddle_fact: 'Wah pintar! Ikan Kukus kaya omega baik untuk kecerdasan otak.',
  },
  {
    id: 'keju_tahu_tempe',
    name: 'Keju & Tahu Tempe',
    emoji: '🧀',
    category: 'protein',
    health_status: 'makanan_super',
    color: 'kuning krem',
    kid_benefit: 'Keju, tahu, dan tempe menjaga tulang kuat dan badan sehat setiap hari!',
    riddle_clues: 'Warnaku kuning lembut dan berbentuk segitiga berlubang kecil. Aku kaya kalsium yang bikin gigi dan tulangmu kuat!',
    riddle_fact: 'Betul sekali! Keju, tahu, dan tempe bikin tulang dan gigi makin kuat.',
  },

  // Sayuran (Makanan Super)
  {
    id: 'brokoli',
    name: 'Brokoli Hijau',
    emoji: '🥦',
    category: 'sayur',
    health_status: 'makanan_super',
    color: 'hijau',
    kid_benefit: 'Brokoli hijau itu seperti pohon mini yang menjaga tubuhmu tetap kebal dari kuman!',
    riddle_clues: 'Warnaku hijau segar dan bentukku persis seperti pohon mini lucu. Aku menjaga tubuhmu tetap sehat dan kuat!',
    riddle_fact: 'Yeay! Brokoli Hijau penuh vitamin yang jadi perisai tubuh dari kuman.',
  },
  {
    id: 'wortel',
    name: 'Wortel Oranye',
    emoji: '🥕',
    category: 'sayur',
    health_status: 'makanan_super',
    color: 'oranye',
    kid_benefit: 'Wortel oranye bikin matamu jernih berkilau seperti mata kelinci yang lincah!',
    riddle_clues: 'Warnaku oranye cerah, bentukku panjang meruncing, dan aku kesukaan kelinci. Aku bikin matamu sehat dan tajam!',
    riddle_fact: 'Tepat! Wortel Oranye kaya vitamin A yang bikin mata sehat berkilau.',
  },
  {
    id: 'tomat',
    name: 'Tomat Merah',
    emoji: '🍅',
    category: 'sayur',
    health_status: 'makanan_super',
    color: 'merah',
    kid_benefit: 'Tomat merah penuh vitamin C yang bikin kulitmu halus dan badan segar!',
    riddle_clues: 'Warnaku merah cerah, bentukku bulat berair, dan di atasnya ada daun hijau kecil. Aku bikin kulitmu sehat dan segar!',
    riddle_fact: 'Bagus sekali! Tomat Merah kaya vitamin yang bikin tubuh segar.',
  },
  {
    id: 'bayam',
    name: 'Bayam Hijau',
    emoji: '🥬',
    category: 'sayur',
    health_status: 'makanan_super',
    color: 'hijau',
    kid_benefit: 'Bayam hijau punya zat besi yang bikin kamu kuat, lincah, dan tidak gampang lelah!',
    riddle_clues: 'Aku berupa daun hijau lembut yang sering ada di sayur bening. Makan aku bikin kamu kuat dan lincah!',
    riddle_fact: 'Hebat! Bayam Hijau bikin tenaga penuh dan badan makin kuat.',
  },

  // Buah (Makanan Super)
  {
    id: 'pisang',
    name: 'Pisang Kuning',
    emoji: '🍌',
    category: 'buah',
    health_status: 'makanan_super',
    color: 'kuning',
    kid_benefit: 'Pisang kuning manis alami dan bikin perut senang serta penuh semangat!',
    riddle_clues: 'Warnaku kuning melengkung seperti bulan sabit dan kulitku mudah dikupas. Aku makanan favorit monyet yang bikin ceria!',
    riddle_fact: 'Hore! Pisang Kuning manis alami dan penuh tenaga ceria.',
  },
  {
    id: 'apel',
    name: 'Apel Merah',
    emoji: '🍎',
    category: 'buah',
    health_status: 'makanan_super',
    color: 'merah',
    kid_benefit: 'Apel merah renyah dan segar membantu menjaga kesehatan jantung serta gigimu!',
    riddle_clues: 'Warnaku merah mengilap, bentukku bulat, dan bunyiku kress renyah saat digigit. Aku buah segar yang bikin badan sehat!',
    riddle_fact: 'Benar! Apel Merah renyah dan penuh serat baik untuk tubuh.',
  },
  {
    id: 'semangka',
    name: 'Semangka Segar',
    emoji: '🍉',
    category: 'buah',
    health_status: 'makanan_super',
    color: 'merah dan hijau',
    kid_benefit: 'Semangka penuh air segar yang menghilangkan haus saat cuaca panas!',
    riddle_clues: 'Kulitku hijau, tapi di dalam warnaku merah cerah dengan biji hitam kecil. Rasaku manis dan penuh air segar!',
    riddle_fact: 'Pintar! Semangka Segar banyak airnya supaya tubuh tidak kehausan.',
  },
  {
    id: 'jeruk',
    name: 'Jeruk Manis',
    emoji: '🍊',
    category: 'buah',
    health_status: 'makanan_super',
    color: 'oranye',
    kid_benefit: 'Jeruk manis kaya vitamin C supaya kamu jarang pilek dan tetap ceria!',
    riddle_clues: 'Warnaku oranye bulat, rasanya manis segar berair, dan di dalamnya ada vitamin C. Aku bikin tubuhmu kebal dari flu!',
    riddle_fact: 'Jempol! Jeruk Manis kaya vitamin C untuk menjaga daya tahan tubuh.',
  },

  // Minuman Sehat (Makanan Super)
  {
    id: 'air_putih',
    name: 'Air Putih',
    emoji: '💧',
    category: 'minuman_sehat',
    health_status: 'makanan_super',
    color: 'bening',
    kid_benefit: 'Air putih bikin tubuh tetap segar, tidak haus, dan membantu konsentrasi!',
    riddle_clues: 'Aku bening seperti kaca dan tidak punya rasa manis, tapi tubuhmu sangat membutuhkanku setiap hari!',
    riddle_fact: 'Hebat! Air Putih adalah minuman terbaik agar tubuh selalu segar.',
  },
  {
    id: 'susu_segar',
    name: 'Susu Segar',
    emoji: '🥛',
    category: 'minuman_sehat',
    health_status: 'makanan_super',
    color: 'putih',
    kid_benefit: 'Susu segar punya kalsium tinggi untuk tulang kuat dan gigi yang sehat!',
    riddle_clues: 'Warnaku putih lembut di dalam gelas dan aku datang dari sapi. Minum aku bikin tulangmu kuat dan cepat tinggi!',
    riddle_fact: 'Yeay! Susu Segar penuh kalsium untuk tulang dan gigi yang kuat.',
  },
  {
    id: 'jus_buah_asli',
    name: 'Jus Buah Asli',
    emoji: '🧃',
    category: 'minuman_sehat',
    health_status: 'makanan_super',
    color: 'oranye',
    kid_benefit: 'Jus buah asli penuh vitamin alami dari buah segar tanpa gula berlebih!',
    riddle_clues: 'Aku minuman segar yang dibuat dari buah asli yang diperas. Rasaku manis alami dan penuh vitamin!',
    riddle_fact: 'Pintar! Jus Buah Asli menyegarkan dan kaya vitamin dari buah.',
  },

  // Camilan Sesekali Saja
  {
    id: 'donat',
    name: 'Donat Manis',
    emoji: '🍩',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'cokelat manis',
    kid_benefit: 'Donat itu enak, tapi gulanya tinggi jadi cukup dinikmati sesekali saja ya!',
  },
  {
    id: 'permen',
    name: 'Permen Warna-warni',
    emoji: '🍭',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'warna-warni',
    kid_benefit: 'Permen manis sekali, jadi makan sesekali saja lalu ingat sikat gigi ya!',
  },
  {
    id: 'kue_krim',
    name: 'Kue Krim',
    emoji: '🍰',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'merah muda',
    kid_benefit: 'Kue krim cocok untuk hari spesial dan dimakan sesekali saja supaya gigi tetap sehat!',
  },
  {
    id: 'es_krim',
    name: 'Es Krim',
    emoji: '🍦',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'krem manis',
    kid_benefit: 'Es krim dingin dan manis, paling pas dinikmati sesekali sebagai camilan!',
  },
  {
    id: 'kentang_goreng',
    name: 'Kentang Goreng',
    emoji: '🍟',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'kuning keemasan',
    kid_benefit: 'Kentang goreng rasanya gurih asin, jadi cukup dimakan sesekali saja ya!',
  },
  {
    id: 'burger',
    name: 'Burger',
    emoji: '🍔',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'cokelat',
    kid_benefit: 'Burger mengandung banyak garam dan saus, jadi dinikmati sesekali saja ya!',
  },
  {
    id: 'keripik_kemasan',
    name: 'Keripik Kemasan',
    emoji: '🥨',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'cokelat renyah',
    kid_benefit: 'Keripik kemasan rasanya asin sekali, cukup sesekali saja dan minum air putih!',
  },
  {
    id: 'soda',
    name: 'Minuman Bersoda',
    emoji: '🥤',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'merah',
    kid_benefit: 'Minuman bersoda punya banyak gula, jadi lebih baik minum air putih setiap hari!',
  },
  {
    id: 'boba_manis',
    name: 'Minuman Boba Manis',
    emoji: '🧋',
    category: 'camilan_sesekali',
    health_status: 'camilan_sesekali',
    color: 'cokelat susu',
    kid_benefit: 'Minuman boba gulanya banyak, jadi boleh dinikmati sesekali saja ya!',
  },
];

export const HYGIENE_PAIRS: HygienePair[] = [
  {
    id: 'apel_kebersihan',
    scenario_voice: 'Apel mana yang bersih dan aman langsung kita makan?',
    healthy_option: {
      emoji: '🍎',
      badgeEmoji: '💧',
      label: 'Apel Dicuci Bersih',
      feedback: 'Hebat! Mencuci buah dengan air bersih bikin kotoran hilang sebelum dimakan.',
    },
    unhealthy_option: {
      emoji: '🍎',
      badgeEmoji: '💨',
      label: 'Apel Jatuh di Tanah',
      feedback: 'Wah, apel yang jatuh di tanah masih ada debunya! Ayo pilih apel yang sudah dicuci bersih.',
    },
  },
  {
    id: 'cuci_tangan',
    scenario_voice: 'Sebelum makan bekal, tangan mana yang siap memegang makanan?',
    healthy_option: {
      emoji: '🙌',
      badgeEmoji: '🧼',
      label: 'Cuci Tangan Pakai Sabun',
      feedback: 'Pintar sekali! Sabun dan air bersih mengusir kuman dari tangan kita.',
    },
    unhealthy_option: {
      emoji: '🖐️',
      badgeEmoji: '🦠',
      label: 'Tangan Kotor Main Tanah',
      feedback: 'Ups, tangan kotor masih menempel debu habis bermain! Yuk pilih tangan yang sudah dicuci pakai sabun.',
    },
  },
  {
    id: 'penyimpanan_bekal',
    scenario_voice: 'Makanan mana yang terjaga bersih dan aman untuk dimakan?',
    healthy_option: {
      emoji: '🍱',
      badgeEmoji: '✨',
      label: 'Bekal Tertutup Rapi',
      feedback: 'Jempolan! Kotak bekal yang tertutup rapat menjaga makanan tetap bersih.',
    },
    unhealthy_option: {
      emoji: '🍢',
      badgeEmoji: '🪰',
      label: 'Jajanan Dihinggapi Lalat',
      feedback: 'Hati-hati ya, lalat membawa debu ke makanan terbuka. Ayo pilih kotak bekal yang tertutup rapi!',
    },
  },
  {
    id: 'botol_minum',
    scenario_voice: 'Minuman mana yang lebih bersih untuk kita minum?',
    healthy_option: {
      emoji: '🧴',
      badgeEmoji: '✨',
      label: 'Botol Minum Tertutup',
      feedback: 'Keren! Botol minum sendiri yang tertutup rapat menjaga air tetap bersih.',
    },
    unhealthy_option: {
      emoji: '🥛',
      badgeEmoji: '🪰',
      label: 'Gelas Terbuka Kena Debu',
      feedback: 'Gelas terbuka mudah kemasukan debu dan lalat! Yuk pilih botol minum yang tertutup bersih.',
    },
  },
];

export const ANIMAL_FRIENDS: AnimalFriend[] = [
  {
    id: 'riko_kelinci',
    name: 'Riko Kelinci',
    emoji: '🐰',
    favoriteHint: 'Riko suka bekal penuh tenaga dan sayur warna-warni!',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
  },
  {
    id: 'kiki_monyet',
    name: 'Kiki Monyet',
    emoji: '🐒',
    favoriteHint: 'Kiki suka buah segar dan lauk lezat biar lincah!',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  {
    id: 'tobi_kurakura',
    name: 'Tobi Kura-kura',
    emoji: '🐢',
    favoriteHint: 'Tobi butuh makanan bergizi dan minuman segar!',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
];

export const BENTO_SLOT_META: Record<
  BentoSlotKey,
  {
    label: string;
    shortLabel: string;
    emoji: string;
    hint: string;
    accentBg: string;
    accentBorder: string;
  }
> = {
  karbohidrat: {
    label: 'Sumber Tenaga',
    shortLabel: 'Karbohidrat',
    emoji: '🍚',
    hint: 'Pilih nasi, roti, jagung, atau kentang',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-300',
  },
  protein: {
    label: 'Lauk Kuat',
    shortLabel: 'Protein',
    emoji: '🍗',
    hint: 'Pilih ayam, telur, ikan, atau keju',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-300',
  },
  sayur_buah: {
    label: 'Sayur & Buah',
    shortLabel: 'Sayur / Buah',
    emoji: '🥦',
    hint: 'Pilih sayur atau buah segar',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-300',
  },
  minuman_camilan: {
    label: 'Minuman Segar',
    shortLabel: 'Minuman',
    emoji: '🥛',
    hint: 'Pilih minuman segar untuk bekal',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-300',
  },
};

export function getItemsForBentoSlot(slot: BentoSlotKey): FoodItem[] {
  switch (slot) {
    case 'karbohidrat':
      return FOOD_ITEMS.filter(
        (f) => f.category === 'karbohidrat' || f.id === 'donat' || f.id === 'kentang_goreng',
      );
    case 'protein':
      return FOOD_ITEMS.filter(
        (f) => f.category === 'protein' || f.id === 'burger' || f.id === 'keripik_kemasan',
      );
    case 'sayur_buah':
      return FOOD_ITEMS.filter(
        (f) =>
          f.category === 'sayur' ||
          f.category === 'buah' ||
          f.id === 'permen' ||
          f.id === 'es_krim',
      );
    case 'minuman_camilan':
      return FOOD_ITEMS.filter(
        (f) => f.category === 'minuman_sehat' || f.id === 'soda' || f.id === 'boba_manis',
      );
  }
}

export const STICKER_CATALOG: StickerItem[] = [
  { id: 'stiker_bintang_koki', name: 'Bintang Koki', emoji: '🌟', bgClass: 'bg-amber-100' },
  { id: 'stiker_bento_juara', name: 'Bento Juara', emoji: '🍱', bgClass: 'bg-orange-100' },
  { id: 'stiker_brokoli_super', name: 'Brokoli Super', emoji: '🥦', bgClass: 'bg-emerald-100' },
  { id: 'stiker_detektif_bersih', name: 'Detektif Bersih', emoji: '🧼', bgClass: 'bg-sky-100' },
  { id: 'stiker_pisang_ceria', name: 'Pisang Ceria', emoji: '🍌', bgClass: 'bg-yellow-100' },
  { id: 'stiker_susu_kuat', name: 'Susu Kuat', emoji: '🥛', bgClass: 'bg-blue-100' },
  { id: 'stiker_apel_segar', name: 'Apel Segar', emoji: '🍎', bgClass: 'bg-rose-100' },
  { id: 'stiker_mahkota_koki', name: 'Mahkota Koki', emoji: '👑', bgClass: 'bg-amber-100' },
];
