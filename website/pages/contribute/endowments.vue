<template>
  <div class="mx-2" style="background-color: white">
    <section-title title="Endowments" id="endowments" />

    <div
      class="text-center my-8"
      :class="`${$device.isMobile ? 'text-body-1' : 'text-h5'}`"
      data-aos="fade-up"
      data-aos-delay="600"
    >
      KSRI has been fortunate to have many endowments created by well-wishers,
      with specific objectives. KSRI carries out these objectives year after
      year, to honour the pursuits and remembrances of the endowments, from the
      interest income of the endowed amounts.
      <br />
      KSRI invites individuals and organizations to come forward with new
      endowments, help preserve our tradition and culture, as also serve some
      higher purpose of satisfaction to the person creating the endowments.
    </div>

    <div
      class="text-h5 font-weight-bold text-center"
      data-aos="fade-up"
      data-aos-delay="700"
    >
      Following are the list of present endowments and its respective
      objectives:
    </div>
    <div v-for="endowment in endownments" :key="endowment.title">
      <!-- for mobile -->
      <v-card
        v-if="$device.isMobile"
        color="transparent"
        elevation="0"
        class="ma-2 my-6 text-body-1"
        rounded="0"
        data-aos="fade-up"
        :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
      >
        <div>
          <div
            class="text-secondary"
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
          >
            {{ endowment.title }}
          </div>
          <div
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 70}`"
          >
            {{ endowment.initiatedBy }}
          </div>
          <div
            class="mt-4"
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 80}`"
          >
            {{ endowment.topic }}
          </div>
          <div class="bottomLine"></div>
        </div>
      </v-card>
      <!-- for desktop - v-row with 3 cols -->
      <v-row
        v-else
        class="ma-2 my-6 text-body-1 bottomBorder"
        data-aos="fade-left"
        :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
      >
        <v-col cols="3">
          <div
            class="text-secondary font-weight-bold"
            data-aos="fade-left"
            :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
          >
            {{ endowment.title }}
          </div>
        </v-col>
        <v-col
          cols="4"
          data-aos="fade-up"
          :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
        >
          <div>{{ endowment.initiatedBy }}</div>
        </v-col>
        <v-col
          cols="5"
          data-aos="fade-up"
          :data-aos-delay="`${endownments.indexOf(endowment) * 50}`"
        >
          <div>{{ endowment.topic }}</div>
        </v-col>
      </v-row>
    </div>

    <contributeHeader />
  </div>
</template>

<script setup>
import contributeHeader from "./contributeHeader.vue";
const endownments = [
  {
    title: "Dr.M. Narasimhachari Endowment",
    initiatedBy: "Instituted by Family members, friends & Students",
    topic: "A lecture is organised every year on Sanskrit Literature",
  },
  {
    title: "Ms. Subbulakshmi Endowment",
    initiatedBy: "Instituted by Family members",
    topic: "A lecture is organised every year on Music",
  },
  {
    title: "R.V.Easwaran Endowment",
    initiatedBy: "Instituted by Family members",
    topic: "A lecture is organised every year on Music",
  },
  {
    title: "D.Ramakrishnan Endowment",
    initiatedBy: "Instituted by Sri P.R.Kannan (son)",
    topic: "A lecture is organised every year on Sanskrit Literature",
  },
  {
    title: "Prof. V.Venkatachalam Endowment",
    initiatedBy: "Instituted by Family members",
    topic: "A lecture is organised every year on Sanskrit Literature",
  },
  {
    title: "Dr.S.Jayasree Endowment",
    initiatedBy: "Endowed by Sri S.Hariharan.",
    topic: "A lecture is conducted on 5th April of every year.",
  },
  {
    title: "Prof.K.A.Lakshmana Sastri Endowment",
    initiatedBy:
      "Endowed by Dr.E.R.Ramabai, former Head, Dept. of Sanskrit, University of Madras",
    topic: "For conducting lecture on any sastra.",
  },
  {
    title: "R.Narasimhachari Endowment",
    initiatedBy:
      "Sloka recitation competition for school students is conducted in the second week of September every year.",
    topic:
      "A lecture on different schools of Vedanta is also conducted in the month of September/October of each year.",
  },
  {
    title: "Sankari Endowment",
    initiatedBy: "Padmasri Dr.A.Sivasailam in memory of Prof.R.Sankari.",
    topic: "Lecture is conducted every year Feb/Mar on any sastra.",
  },
  {
    title: "Prof.P.S.Subrahmanya Sastri Centenary Endowment",
    initiatedBy: "Instituted by Dr.P.N.Natarajan.",
    topic:
      "Lecture is arranged every year in the month of Nov.-March on grammar, linguistics orTamil studies.",
  },
  {
    title: "R. Srinivasatatachari Endowment",
    initiatedBy: "Mrs.Sarayu Srinivasan .",
    topic: "A lecture is organized each year in November on dance and music.",
  },
  {
    title:
      "Navypakkam Mimisal Narasimha Patrachariar Endowment and Justice N.Rajagopala Ayyangar Endowment",
    initiatedBy:
      "LinkedInuted by Sri N.Raghunathan, Former Chief Secretary, Govt. of Maharashtra.",
    topic:
      "Lectures are conducted in the month of Oct/Nov. on Law and Jurisprudence",
  },
  {
    title: "Suryakumari Dwarakadas Endowment",
    initiatedBy: "LinkedInuted by Sri D.Suresh, member of Governing Body",
    topic:
      "KSRI - Interschool Bhagavadgita recitationis being organized every year on the 1st Saturday of September",
  },
  {
    title: "Guna Pai Priyamvada Bai Endowment",
    initiatedBy:
      "LinkedInuted by Mr.Vasant Pai, Senior Advocate, Madras High Court Anthyakshari sloka recitation competition for school children.",
    topic: "It is being conducted every year in the month of Jan/Feb.",
  },
  {
    title: "Dr.S.S.Janaki Endowment",
    initiatedBy: "Instituted by family members",
    topic: "For publication of Journal of Oriental Research",
  },
  {
    title: "Dr.V.Raghavan Endowment",
    initiatedBy: "Instituted by family members",
    topic: "Kombur Ramabhadran Endowment",
  },
  {
    title: "Kombur Ramabhadran Endowment",
    initiatedBy: "Instituted by Sri R.T.Chari.",
    topic:
      "Senior Sanskrit scholar is being honoured with a purse of Rs.10,000/- every year in the month of Oct/Nov.",
  },
  {
    title: "Sundaram Sarawathi Endowment",
    initiatedBy:
      "LinkedInuted by Mrs.Saraswathi Sundaram and students and colleagues of Dr.C.S.Sundaram.",
    topic:
      "Lecture is arranged in the month of July/Aug. on literature, drama etc.",
  },
  {
    title: "S.Subbalakshmi Ammal Endowment",
    initiatedBy: "LinkedInuted by Mrs.S.Subbalakshmi",
    topic: "For a lecture on Music",
  },
  {
    title: "Shankar Vidya Endowment",
    initiatedBy: "LinkedInuted by Mrs.Vidya Shankar",
    topic: "For a lecture on Music",
  },
  {
    title: "R.V.Eswaran Endowment",
    initiatedBy: "LinkedInuted by Mrs.Krishna Easwaran",
    topic: "For a lecture on Music in Aug/Sept",
  },
  {
    title: "Rajam Ramaswami Endowment",
    initiatedBy: "LinkedInuted by Mrs. Sundari Mani.",
    topic: "For a lecture on literature",
  },
  {
    title: "S.Subhadra Endowment",
    initiatedBy: "LinkedInuted by Family members, friends & Students",
    topic: "A lecture is organised every year on Sanskrit Literature",
  },
];

const scrollTo = () => {
  const endowments = document.getElementById("endowments");
  if (endowments) {
    endowments.scrollIntoView({ behavior: "smooth" });
  }
};

// on mounted scroll to id div with id endowments
onMounted(() => {
  scrollTo();
});

// get active menu option from url
const route = useRoute();

// watch route change scroll to id div with id endowments
watch(
  () => route.fullPath,
  () => {
    console.log(route.fullPath);
    scrollTo();
  }
);
</script>

<style scoped>
.bottomLine {
  background-color: #abbe88;
  width: 100%;
  height: 2px;
}
.bottomBorder {
  border-bottom: 2px solid #abbe88;
}
</style>
