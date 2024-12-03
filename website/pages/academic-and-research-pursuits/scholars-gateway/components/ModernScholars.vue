<template>
  <div>
    <div class="d-flex flex-row justify-center">
      <div v-for="button in buttons" :key="button">
        <v-btn
          rounded="pill"
          color="primary"
          class="ma-2"
          :variant="activeButton === button ? 'flat' : 'outlined'"
          @click="activeButton = button"
        >
          {{ button }}
        </v-btn>
      </div>
    </div>

    <!-- display present scholars -->
    <div v-if="activeButton === 'Present'">
      <presentPastScholars
        :courses="courses"
        :supervisors="supervisors"
        :mPhilStudentsBySupervisor="mphilStudentsBySupervisor"
        :phdStudentsBySupervisor="phdStudentsBySupervisor"
      />
    </div>

    <!-- display past scholars -->
    <div v-if="activeButton === 'Past'">
      <presentPastScholars
        :courses="courses"
        :supervisors="supervisors"
        :mPhilStudentsBySupervisor="pastMPhilStudentsBySupervisor"
        :phdStudentsBySupervisor="pastPhdStudentsBySupervisor"
      />
    </div>
  </div>
</template>

<script setup>
import presentPastScholars from "./presentPastScholars.vue";

let buttons = ["Present", "Past"];

let activeButton = ref("Present");

const courses = [
  {
    name: "M.Phil",
    subTitle: "(Affiliated to the University of Madras)",
  },

  {
    name: "Ph.D.",
    subTitle: "(Affiliated to the University of Madras)",
  },
];

const supervisors = [
  "Dr. V. Kameswari",
  "Dr. K.S.Balasubramanian",
  "Dr. T.V.Vasudeva",
  "Dr. V. Yamuna Devi",
  "Dr. S.S. Janaki",
];

const presentStudents = [
  {
    name: "V.R.Srinivasan",
    course: "M.Phil",
    areaOfStudy: "Manju Ramayanam - A study",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Preethi Mahesh",
    course: "Ph.D.",
    areaOfStudy: "Chennai in Sanskrit Literature - Awaiting Viva",
    supervisor: "Dr. V. Kameswari",
  },

  {
    name: "Ms.N. Bhuvanesawri",
    course: "Ph.D.",
    areaOfStudy:
      "Critical Study of the play Prasanna Raghava of Jayadeva - Submitted Synopsis",
    supervisor: "Dr. V. Kameswari",
  },

  {
    name: "Ms.Goda Devi",
    course: "Ph.D.",
    areaOfStudy:
      "Kasyapa Samhita- text on Vishacikitsa: A Critical study- Submitted synopsis",
    supervisor: "Dr. V. Kameswari",
  },

  {
    name: "Ms.Renganayaki",
    course: "Ph.D.",
    areaOfStudy: "Surya in Sanskrit Literature - A scientific approach",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "K.N.Srikkanth",
    course: "Ph.D.",
    areaOfStudy:
      "Contribution of Sridhara and Sripati to Indian Mathematics - Viva Awaited",
    supervisor: "Dr. K.S.Balasubramanian",
  },
  {
    name: "Mr. S. Balakrishnan",
    course: "Ph.D.",
    areaOfStudy: "Vrttaratnasangraha of Raghunatha",
    supervisor: "Dr. T.V.Vasudeva",
  },

  {
    name: "Mrs.R.Rajalakshmi",
    course: "Ph.D.",
    areaOfStudy: "Critical analysis of Adbhuta Darpana",
    supervisor: "Dr. T.V.Vasudeva",
  },
  {
    name: "Mr.P.S. Chandrasekharan",
    course: "Ph.D.",
    areaOfStudy: "Ganita Kaumudi",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. S. Madhurambika",
    course: "Ph.D.",
    areaOfStudy: "Sahendra Vilasa",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Vijayalakshmi Mani",
    course: "Ph.D.",
    areaOfStudy:
      "Ganita - Sredhi Vyavahara, Progression in Ancient Indian Mathematics",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Lavanya V Eswar",
    course: "Ph.D.",
    areaOfStudy: "Advaitic principles in Yoga vasishtha",
    supervisor: "Dr. V. Yamuna Devi",
  },
];

const mphilStudents = computed(() => {
  return presentStudents.filter((student) => student.course === "M.Phil");
});

const mphilStudentsBySupervisor = (supervisor) => {
  return mphilStudents.value.filter(
    (student) => student.supervisor === supervisor
  );
};

const phdStudents = computed(() => {
  return presentStudents.filter((student) => student.course === "Ph.D.");
});

const phdStudentsBySupervisor = (supervisor) => {
  return phdStudents.value.filter(
    (student) => student.supervisor === supervisor
  );
};

// past Phd students
const pastPhdStudents = [
  {
    name: "A.R.Panduranga Rao",
    course: "Ph.D.",
    areaOfStudy: "Critical study of Nyaya vivarana of Ananda Tirtha",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "S.S.Rangan",
    course: "Ph.D.",
    areaOfStudy: "Critical edition & study of Tattvagunadarsa of Annayarya",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "K.Srinivasan",
    course: "Ph.D.",
    areaOfStudy: "Vyayoga a Sanskrit Drama type : Theory and Practice",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "Dr. K.S.Balasubramanian",
    course: "Ph.D.",
    areaOfStudy: "Yoga Yajnavalkya - A Critical Study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. Sita Sundar Ram",
    course: "Ph.D.",
    areaOfStudy: "Krsna Daivajna's Bija Pallava - A Critical study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. S.Annapurna",
    course: "Ph.D.",
    areaOfStudy: "Vidhitraya Paritrana of Venkatadhvarin - A Critical Study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. V. Anusha",
    course: "Ph.D.",
    areaOfStudy: "Purusa Pariksa - A Socio-Cultural Study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. R.Subasri",
    course: "Ph.D.",
    areaOfStudy: "Women Rights in Dharmasastra",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. B. Ramadevi",
    course: "Ph.D.",
    areaOfStudy: "Dream Motif in Sanskrit Literature",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. V. Umamaheswari",
    course: "Ph.D.",
    areaOfStudy: "Amogaraghava Campu - Critical edition and study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. V. Yamunadevi",
    course: "Ph.D.",
    areaOfStudy: "Amarakosodghatana of Ksirasvamin - A critical Study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. V. Premalatha",
    course: "Ph.D.",
    areaOfStudy: "Sthalavrkshas and their Ecological Value",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms.S.Anusha",
    course: "Ph.D.",
    areaOfStudy: "A critical analysis of Nitiprakasika, a treatise on war",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms.J.Subhadra",
    course: "Ph.D.",
    areaOfStudy:
      "Unnatural Phenomena (prakriti vikara) analysed in Jyotisa texts",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms.K.Ramakalyani",
    course: "Ph.D.",
    areaOfStudy:
      "The mathematical importance of Buddhivilasini , Comm.. on Bhaskara's Lilavati",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms.G.D.Jayalakshmi",
    course: "Ph.D.",
    areaOfStudy: "Jivanandana - A Critical Study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "K. Srikanthan",
    course: "Ph.D.",
    areaOfStudy: "Contribution of Cakrakavi to Sanskrit Literature",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "T.V.Vasudeva",
    course: "Ph.D.",
    areaOfStudy: "Percepts and Practices of Samnyāsa Āśrama",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms.M Archana",
    course: "Ph.D.",
    areaOfStudy: "Critical Analysis of Siva Samhita",
    supervisor: "Dr. K.S.Balasubramanian",
  },

  {
    name: "Ms.S.Muthulakshmi",
    course: "Ph.D.",
    areaOfStudy: "Yogic Elements in Mahakavyas",
    supervisor: "Dr. K.S.Balasubramanian",
  },

  {
    name: "K.Nagarajan",
    course: "Ph.D.",
    areaOfStudy: "Critical study of Jirnodhara Dasaka",
    supervisor: "Dr. K.S.Balasubramanian",
  },

  {
    name: "P.C.Muralidharan",
    course: "Ph.D.",
    areaOfStudy: "Parijathahara Nataka - A critical study",
    supervisor: "Dr. K.S.Balasubramanian",
  },

  {
    name: "Ms. S. Anuradha",
    course: "Ph.D.",
    areaOfStudy:
      "Amritasiddhiyoga of Virupakshasiddha - A Critical Edition and Study",
    supervisor: "Dr. K.S.Balasubramanian",
  },

  {
    name: "Ms. Jayadevi",
    course: "Ph.D.",
    areaOfStudy: "Sayanacarya viracita Purusarthasudhanidhi",
    supervisor: "Dr. K.S.Balasubramanian",
  },

  {
    name: "Ms.Vaishnavi Poorna",
    course: "Ph.D.",
    areaOfStudy: "Musical elements in Sanskrit Drama",
    supervisor: "Dr. K.S.Balasubramanian",
  },

  {
    name: "Mr.S.Balasubramanian",
    course: "Ph.D.",
    areaOfStudy: "Satasloki with comm. - a critical analysis",
    supervisor: "Dr. T.V.Vasudeva",
  },
  {
    name: "Mr.S.Gopalan",
    course: "Ph.D.",
    areaOfStudy: "Atmajnana vivarana - a critical study",
    supervisor: "Dr. T.V.Vasudeva",
  },
  {
    name: "Mr.V.Ramakrishnan",
    course: "Ph.D.",
    areaOfStudy: "Contribution of Nalladvarin to Skt. Literature",
    supervisor: "Dr. T.V.Vasudeva",
  },
  {
    name: "Mrs.Vasumathi",
    course: "Ph.D.",
    areaOfStudy: "Commentaries of Dakshinavarthanatha",
    supervisor: "Dr. T.V.Vasudeva",
  },
  {
    name: "Mr.S.Umapathy",
    course: "Ph.D.",
    areaOfStudy: "Contribution of Rajachudamani Diksita to Skt. Literature",
    supervisor: "Dr. T.V.Vasudeva",
  },
  {
    name: "Mr.G.Venkataraman",
    course: "Ph.D.",
    areaOfStudy: "Socio Cultural study of Kshemendra's works",
    supervisor: "Dr. T.V.Vasudeva",
  },
  {
    name: "Ms. K. Vidyuta",
    course: "Ph.D.",
    areaOfStudy: "Kasyapa Silpasastra on Prakara, Mandapa and Gopura Laksana",
    supervisor: "Dr. T.V.Vasudeva",
  },
];

const pastPhdStudentsBySupervisor = (supervisor) => {
  return pastPhdStudents.filter((student) => student.supervisor === supervisor);
};

//  past M.Phil students
const pastMPhilStudents = [
  {
    name: "Lokanayaki Ammal",
    course: "M.Phil",
    areaOfStudy: "Siva elements in Ramayana",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "Hema Ramanathan",
    course: "M.Phil",
    areaOfStudy:
      "Comparative study of the poetics of Anandavardhana and Susanne Langer",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "G.D.Jayalakshmi",
    course: "M.Phil",
    areaOfStudy: "Rukminiharana of Vatsaraja",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "G.Meenakshi",
    course: "M.Phil",
    areaOfStudy: "A critical study of Vakrokti Pancasika of Ratnakara",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "K.Srinivasan",
    course: "M.Phil",
    areaOfStudy: "Tripuradaha Dima",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "V.Vasudevan",
    course: "M.Phil",
    areaOfStudy: "Bhramara Kahali-Eng.trans. & study",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "P.K.Bhaskaran",
    course: "M.Phil",
    areaOfStudy: "Upakramaparakrama of Appaya Diksita - A critical Study",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "N.Sridhar",
    course: "M.Phil",
    areaOfStudy: "Lilavati Vithi- A Critical study",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "Premavathi",
    course: "M.Phil",
    areaOfStudy:
      "A critical study of Nakshatramala of Sivarama Tripathin with Eng. Trans.",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "R.Padmini",
    course: "M.Phil",
    areaOfStudy: "Critical study of Candrakala Natika of Viswanatha",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "N.Ambika",
    course: "M.Phil",
    areaOfStudy:
      "Movement (Gatis) in Natya according to Bharata's Natyasastra.",
    supervisor: "Dr. S.S. Janaki",
  },
  {
    name: "R.Subasri",
    course: "M.Phil",
    areaOfStudy: "Irony in Sanskrit Literature",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "B.Ramadevi",
    course: "M.Phil",
    areaOfStudy: "Ganjifa Khelana of Giridhara - A study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. N. Meena",
    course: "M.Phil",
    areaOfStudy: "Code Language in War And Politics",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. A. Yamuna Devi",
    course: "M.Phil",
    areaOfStudy: "Critical Edition and Study of Paniniya Sutrodaharana Kavya",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Ms. V. Premalatha",
    course: "M.Phil",
    areaOfStudy: "Amanaska Yoga - A Critical Study",
    supervisor: "Dr. V. Kameswari",
  },
  {
    name: "Mr K.P. Srikanth",
    course: "M.Phil",
    areaOfStudy: "Dosapariharas in Brhatparasara Horasastra",
    supervisor: "Dr. K.S. Balasubramanian",
  },
  {
    name: "Mr. S. Nagarajan",
    course: "M.Phil",
    areaOfStudy: "Yogapada of Matanga Parameswaragama",
    supervisor: "Dr. K.S. Balasubramanian",
  },
  {
    name: "Ms.Vibha Raghav",
    course: "M.Phil",
    areaOfStudy: "Goraksha Samhita - A Critical Study",
    supervisor: "Dr. K.S. Balasubramanian",
  },
  {
    name: "Ms.S.Padmapriya",
    course: "M.Phil",
    areaOfStudy: "Karani in Ganitasastra - An analysis",
    supervisor: "Dr. K.S. Balasubramanian",
  },
  {
    name: "Mr.S.Margabandhu",
    course: "M.Phil",
    areaOfStudy: "Yogic elements in Mrgendra Agama",
    supervisor: "Dr. K.S. Balasubramanian",
  },
  {
    name: "Ms. S. Anuradha",
    course: "M.Phil",
    areaOfStudy: "Varahopanisad",
    supervisor: "Dr. K.S. Balasubramanian",
  },
  {
    name: "Mr. K. Nagarajan",
    course: "M.Phil",
    areaOfStudy: "Yogabija",
    supervisor: "Dr. K.S. Balasubramanian",
  },
  {
    name: "Ms. S. Anusha",
    course: "M.Phil",
    areaOfStudy: "Critical Analysis of Drstanta-kalikasataka",
    supervisor: "Dr. T.V. Vasudeva",
  },
  {
    name: "Ms. M. Archana",
    course: "M.Phil",
    areaOfStudy: "Unmattaraghava of Virupaksa - A Study",
    supervisor: "Dr. T.V. Vasudeva",
  },
  {
    name: "Ms.S.Hemavathy",
    course: "M.Phil",
    areaOfStudy: "Caturvarga Sangraha of Ksemendra - A Study",
    supervisor: "Dr. T.V. Vasudeva",
  },
  {
    name: "Mr.G.Venkataraman",
    course: "M.Phil",
    areaOfStudy: "Sevya Sevakopadesa of Ksemendra - A study",
    supervisor: "Dr. T.V. Vasudeva",
  },
  {
    name: "Ms.Brinda Gandhi",
    course: "M.Phil",
    areaOfStudy: "Nilakantha Diksita's Vairagyasatakam - A study",
    supervisor: "Dr. T.V. Vasudeva",
  },
  {
    name: "Ms.Vidyuta K",
    course: "M.Phil",
    areaOfStudy: "Devaprasada in Vishvakarma Vastushastra",
    supervisor: "Dr. T.V. Vasudeva",
  },
  {
    name: "Ms. Gowri T",
    course: "M.Phil",
    areaOfStudy: "Lingavrtti vicara of Vararuci- A Study",
    supervisor: "Dr. T.V. Vasudeva",
  },
  {
    name: "Ms. J Mythili",
    course: "M.Phil",
    areaOfStudy: "Yogakundalini Upanisad",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Mrinalini",
    course: "M.Phil",
    areaOfStudy: "Sandilyopanisad- A Critical study",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Latha",
    course: "M.Phil",
    areaOfStudy: "Krishnabhupaliyam",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Rajalakshmi",
    course: "M.Phil",
    areaOfStudy: "Cola Campu",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Ramya Bhatt",
    course: "M.Phil",
    areaOfStudy: "Significance of Vadavagni",
    supervisor: "Dr. V. Yamuna Devi",
  },
  {
    name: "Ms. Iswarya",
    course: "M.Phil",
    areaOfStudy: "Yogacudamani Upanisad- A Critical study",
    supervisor: "Dr. V. Yamuna Devi",
  },
];

const pastMPhilStudentsBySupervisor = (supervisor) => {
  return pastMPhilStudents.filter(
    (student) => student.supervisor === supervisor
  );
};
</script>
