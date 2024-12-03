<template>
  <div>
    <div>
      <section-title title="KSRI PUBLICATIONS" />
      <div class="sectionSubtitle2">
        KSRI has been publishing the Journal of Oriental Research periodically
        from its inception till date and it is internationally well known.
      </div>
    </div>
    <div class="text-center my-8">
      <nuxt-link to="/academic-and-research-pursuits/ksri-publications/books">
        <v-btn rounded="pill" variant="outlined" color="primary">
          List of Book Catalogue
        </v-btn>
      </nuxt-link>
    </div>
    <div class="text-center my-4">
      <div class="text-h6">
        A Committee is constituted to help the Institute in identifying the
        texts to be published and also in other matters related to the research
        work of the Institute. At present the following scholars are the
        members.
      </div>
    </div>
    <div>
      <div v-for="key in publicationCommitteeKeys" class="ma-6" :key="key">
        <div
          class="sectionTitle3 my-2"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {{ key }}
        </div>
        <CommitteeMembers
          :governingBodyMembers="publicationCommittee"
          :governingBodyMembersKey="key"
        />
      </div>
    </div>

    <div class="text-center ma-6">
      <div class="sectionSubtitle" data-aos="fade-up">Overview</div>
      <div class="text-h6" data-aos="fade-up">
        As a premier Institution in the field of research, KSRI has involved
        itself actively in the pursuit of excellence in its field of
        specialisation. In order to remain competitive and abreast of the
        requirement of Scholars, it is essential that the enhancement of
        Knowledge and Professional Expertise are maintained at a sufficiently
        higher level.
      </div>
    </div>
    <div class="text-center">
      <v-card
        class="ma-4 pa-6 d-flex flex-column justify-space-between align-center"
        rounded="0"
        v-for="publicationCard in publicationCards"
        :key="publicationCard.title"
        data-aos="fade-up"
      >
        <div class="text-h5" data-aos="fade-right">
          {{ publicationCard.title }}
        </div>
        <div class="horizontalLine my-3" style="--line-width: 10%"></div>
        <div data-aos="fade-left">
          {{ publicationCard.description }}
        </div>
      </v-card>
    </div>

    <div class="my-6">
      <!-- Publications for Sale -->

      <publicationForSale
        :publicationsForSale="publicationsForSale"
        title="Publications for Sale"
      />

      <publicationForSale
        :publicationsForSale="publicationsOutOfStock"
        title="Publications Out of Stock"
      />
    </div>

    <!-- Samskrita Academy Publications -->
    <div class="my-6">
      <v-card rounded="0" class="ma-4 pa-6">
        <div class="d-flex flex-column align-center">
          <div class="text-h5" data-aos="fade-right">
            Samskrita Academy Publications
          </div>
          <div class="horizontalLine my-3" style="--line-width: 10%"></div>
        </div>
        <div
          v-for="samskritaAcademyPublication in samskritaAcademyPublications"
          :key="samskritaAcademyPublication.name"
          class=""
        >
          <v-list-item data-aos="fade-up" class="ma-2">
            <!-- prepend book icon  -->
            <template v-slot:prepend>
              <v-icon>mdi-book-open-blank-variant-outline</v-icon>
            </template>

            <div>
              <v-row class="">
                <v-col cols="12" md="10">
                  <div>
                    {{ samskritaAcademyPublication.name }}
                  </div>
                </v-col>
                <v-col cols="12" md="2">
                  <div>{{ samskritaAcademyPublication.price }}</div>
                </v-col>
              </v-row>
            </div>
          </v-list-item>
          <div class="horizontalLine" style="--line-height: 1px"></div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import publicationForSale from "../components/publicationForSale.vue";
const publicationCommittee = {
  "Research Committee": [
    {
      name: "Dr.K. Srinivasan",
    },
    {
      name: "Dr.V.Kameswari",
    },
    {
      name: "Dr.K.S.Balasubramanian",
    },
    {
      name: "Dr.T.V.Vasudeva",
    },
    {
      name: "Prof. R.Parthasarathy",
    },
    {
      name: "Dr. Sita Sundar Ram",
    },
    {
      name: "Dr.V.Yamuna Devi",
    },
  ],
  "Editorial Committee": [
    {
      name: "Dr.V.Kameswari",
    },

    {
      name: "Dr.K.S.Balasubramanian",
    },
    {
      name: "Dr.T.V.Vasudeva",
    },
    {
      name: "Dr.V.Yamuna Devi",
    },
    {
      name: "Dr.P.C.Muralidharan",
    },
    {
      name: "Dr.V.Preethi",
    },
  ],
};
const publicationCommitteeKeys = Object.keys(publicationCommittee);

const publicationCards = [
  {
    title: "The Journal of Oriental Research",
    description:
      "Initiated by Professor S. Kuppuswami Sastri in 1927, the 'Journal of Oriental Research' is a reputed internationally acclaimed magazine covering various aspects involved in Sanskrit and Indological studies. The publication of this magazine was entrusted to the Institute from 1944. 91 Volumes of the journal have been published so far. The Journal, admittedly reputed for original research and scientific investigation, carries general, critical and research articles on diverse indological subjects. Some rare texts, critically edited and appear serially as supplementary to the original volumes later get published as independent books.",
  },
  {
    title: "Books/Monographs/Reprints",
    description:
      "Books and Monographs are being published periodically as an endeavour to promote Sanskrit and Indological Studies. They cover a wide range of subjects which include Vedic Studies, Yoga, Literature, Language, Grammar, Philosophy, Religion, Mathematics, Astronomy, Astrology, Medical Science, Ayurveda, Arthasastra, Purva Mimamsa, Advaita, Nyaya, Vaishnavism, Saivism, Arts, Science, etc. Around 100 Books and Monographs including critical editions of hitherto unpublished manuscripts on different aspects of Sanskrit and Indology have also been published so far.",
  },
  {
    title: "Milestones in KSRI Publication",
    description: `Publications of the Institute have received wide acclaim and appreciation from scholars all over the world and have been reviewed in the National Dailies like "The Hindu", Academic Journals and other magazines in India and Abroad. KSRI takes pride in announcing the publication of the most ancient Tamil text on grammar "Tolkappiyam" with Roman transliteration and English translation. "Artha Sastra" of Kautilya, acclaimed as the best source of information on ancient Indian Polity and Economics was published for the first time with two lesser known commentaries. Publication of "Lectures on Patanjali's Mahabhashya" by Dr.P.S.Subrahmanya Sastri and "A critical study on Bija Pallava", a 16th Century Text on Algebra have received appreciation from around the world. It had been conducting Seminars, Conferences and Workshops which pave the way for sharing of knowledge and information, assimilation of ideas and expertise for preservation and upkeep of archives.`,
  },
];

const publicationsForSale = [
  "Gadyakarnamrta, an Historical Kavya, ed. With critical introduction by Dr.S.S.Janaki",
  "Highways and Byways of Literary Criticism in Sanskrit by Prof.S.Kuppuswami Sastri",
  "Compromises in the History of Advaitic Thought by Prof.S.Kuppuswami Sastri",
  "Primer of Indian Logic by Prof.S.Kuppuswami Sastri (IV edition)",
  "Tolkappiyam (Eluttu) with English Transliteration, translation and notes Prof.P.S.Subrahmanya Sastri (II Edition)",
  "History of Grammatical Theories in Tamil by Prof.P.S.Subrahmanya Sastri (II Edition)",
  "Tolkappiyam (Porul - Tamil Poetics) with English Transliteration, translation and notes by Prof.P.S.Subrahmanya Sastri (II Edition)",
  "Astanga Nighantu (Medical Text) ed. By P.V.Sarma, Eng. and Tamil translation by Dr.K.S.Viswanatha Sarma",
  "Mm.Kuppuswami Sastri Birth-centenary Commemoration volume Pt.I",
  "Mm.Kuppuswami Sastri BIrth-centenary Commemoration volume Pt.II",
  "The Concept of Beautiful in Sanskrit Literature by Dr.V.Raghavan",
  "Karpuracarita Bhana ed. With Eng. Translation by Dr.S.S.Janaki",
  "Samskrita Vayavaharah - Spoken Sanskrit, ed. Dr.S.S.Janaki (II Edition)",
  "Umapati Sivam, His life and Contribution to Saivism, ed. Dr.S.S.Janaki",
  "Eclipses in Hindu Life and Thought - a rationalistic analysis by Dr.S.Jayasree",
  "Research in Sanskrit A classified Guide by Dr.K.V.Sarma",
  "Manuscripts Collection of the Desamangalam Variyam by Dr.K.V.Sarma",
  "Navamuktasatakam Transcomposition into Sanskrit and English verse from the Tamil classic Muttollayiram by Sri A.V.Subramanian",
  "Palandumandana Prahasana, text with translation by Dr.S.S.Janaki",
  "Samskrta Sahitya Itihasah (History of Sanskrit Literature) by R.S.Venkatarama Sastri",
  "Bhasasastrapravesini (A Handbook of Comparative Philology) by R.S.Venkatarama Sastri",
  "Sanskrit & Science ed. Dr.S.S.Janaki",
  "Valmiki Ramayana (condensed in the poet's own words with Eng.Tr.)",
  "The Mahabharata(condensed in the poet's own words with Eng.Tr.)",
  "Srimad Bhagavata(condensed in the poet's own words with Eng.Tr.)",
  "Women's Role in Kudiyattam by Sri L.S.Rajagopalan",
  "Kudiyattam: Preliminaries & Performance by Sri L.S.Rajagopalan",
  "Bhagavadgita Bibliography - I (Manuscripts) by Dr.C.S.Sundaram",
  "Saiva Rituals and Philosophy ed. Dr.S.S.Janaki",
  "Kalamukha and Pasupatha temples in Dharwar by Dr.Mrs.Vasundhara Filliozat",
  "Ramabhadra Diksita and his works by Dr.A.Thiruvengadathan",
  "Kavyalankara Sutra Vrtti of Vamana withEng. Trans. by Dr.K.K.Raja",
  "Some Aspects of Sanskrit Drama and Dramaturgy by S.S.Janaki",
  "Darsanopanisad, Text with Eng. Tr. by Dr. K.S. Balasubramanian and Dr. T.V.Vasudeva.",
  "Advayatarakopanisat Text with Eng. Tr. by Dr. K.S. Balasubramanian and Dr. T.V.Vasudeva.",
  "Srinandikesakasika of Upamanyu Text with Eng. Tr. by Dr. K.S. Balasubramanian and Dr. T.V.Vasudeva.",
  "Bhagavadgita Bibliography - II (Edn. Trs. and Studies) by Dr. C.S. Sundaram",
  "Vedas : Traditional and Modern Perspectives ed. Dr.V.Kameswari",
  "Tattvanusandanam by Mahadevananda Saraswati - Critical edition and tr. With critical introduction - to be released in May 2008.",
  "Samskrita and Sangita by Dr.S.S.Janaki",
  "Sadratnamala of Sankara Varman (Astronomical text) ed. With English tr. By Dr.S.Madhavan",
  "Sanketa Kosa - A Dictionary on Numerals - by Mar. 2009",
  "Bija Pallava of Krsna Daivajna (Algebra in 16th Cent. India), a critical study by Dr.Sita Sundar Ram",
  "Lectures on Patanjali's Mahabhasya by Prof.P.S.Subrahmanya Sastri, Vol.VII,VIII, IX, X & XI",
  "Siva Linga Worship -Authentic documentary (in VCD) on Siva Linga worship to be performed daily the temples as prescribed in the Saiva Agamic texts. Running commentary available in English or Tamil.",
];

const publicationsOutOfStock = [
  "Vibhramaviveka of Mandana Misra (Mimamsa Text)",
  "Vinavasavadatta (an old Sanskrit drama)",
  "Dhvanyaloka & Locana - Pt.I",
  "The Kuppuswami Sastri Commemoration Volume",
  "Kuppuswami Sastri Memorial Volume",
  "Cintamanisaranika of Bodhisattva Dasabala",
  "Sakkottai Inscriptions",
  "Grahacaranibandhana (Astrology)",
  "Bharata Sangraha",
  "Arthasastra with Canakyatika",
  "Vakyakarana (Astrology)",
  "Arthasastra with the Tika of Bhiksuprabhamati",
  "The Census of Astronomical Manuscripts in England.",
  "Nalopakyana Sangraha (3 Editions)",
  "Srivacanabhushana of Pillai Lokacharya",
  "Pratima Nataka of Bhasa (Text & Translation)",
  "Pratima Nataka Study guide",
  "Siva Temple and Temple Rituals",
  "Dhvajastambha",
  "Rajasekhara and his Kavyamimamsa",
  "Mm.S.Kuppuswami Sastri",
];

// Samskrita Academy Publications
const samskritaAcademyPublications = [
  {
    name: "Tamraparni Mahatmya with Tamil translation by A.R. Ganapathi Sastri (bringing out the glory of the perennial river of Tamil Nadu in 6200 verses, divided into 64 chapters, comprising of 1700 pages in 2 parts).",
    price: "₹ 2000",
  },
  {
    name: "Gitamrtamahodadhi by (late) Brahmasri Viswanatha Sastri.",
    price: "₹ 500",
  },
  {
    name: "Rahasyatrayasara of Sri Vedanta Desika with English translation by Sri N. Raghunathan, I.A.S. (Former Chief Secretary of Maharashtra)",
    price: "₹ 1000",
  },
  {
    name: "Lectures on the Bhagavadgita (3 Vols. in 1set) by Swami Paramarthananda",
    price: "₹ 600",
  },
  {
    name: "Sankara and Shanmata",
    price: "₹ 500",
  },
  {
    name: "Aryacharitram",
    price: "₹ 300",
  },
  {
    name: "Srimad Valmiki Ramayana Sangraha",
    price: "₹ 300",
  },
  {
    name: "Culture and Creativity by K.Chandrasekharan",
    price: "₹ 200",
  },
  {
    name: "Golden Harvest by K.Chandrasekharan",
    price: "₹ 200",
  },
  {
    name: "Ramayana Peruraigal (Tamil)",
    price: "₹ 150",
  },
  {
    name: "Key to Antoine's Sanskrit Manual",
    price: "₹ 100",
  },
  {
    name: "The Mahabharata by Mastri Venkatesa Iyengar",
    price: "₹ 100",
  },
  {
    name: "Tagore A Master Spirit by K.Chandrasekharan",
    price: "₹ 100",
  },
  {
    name: "Tagore and Indian Literature by K.Chandrasekharan",
    price: "₹ 50",
  },
  {
    name: "Manche Sloka and Atmarama of Samartha Ramadasa",
    price: "₹ 80",
  },
  {
    name: "Jayanteya Gita, text with Eng. translation",
    price: "₹ 80",
  },
  {
    name: "Catussutri – A Study",
    price: "₹ 75",
  },
  {
    name: "Manasolla Stuti of Appayya Dikshitawith Eng. translation",
    price: "₹ 60",
  },
  {
    name: "Ramayana Triveni K.Chandrasekharan",
    price: "₹ 60",
  },
  {
    name: "An Approach to Indian Art",
    price: "₹ 50",
  },
  {
    name: "Pulavar Pottrum Punithar V.Krishnaswami Iyer By Mm.Dr.U.Ve. Swaminatha Iyer (Tamil)",
    price: "₹ 40",
  },
  {
    name: "Cosmology, God and the Indian Scriptures",
    price: "₹ 40",
  },
  {
    name: "Sri Karpakavalli Satakam",
    price: "₹ 25",
  },
  {
    name: "Physical Health and Mental Health by Swami Paramarthananda",
    price: "₹ 120",
  },
  {
    name: "Ramayana Diary",
    price: "₹ 150",
  },
  {
    name: "Lectures on the Ramayana by Rt.Hon'ble V.S.Srinivasa Sastri",
    price: "₹ 200",
  },
  {
    name: `Stories of Ancient India (Eng. Tr. of Selection form "Aryacharitam" Compiled by Sri V.Krishnaswami Iyer) by Dr.Sita Sundar Ram & Dr.V.Premalatha`,
    price: "₹ 200",
  },
];
</script>
