<template>
  <div style="background-color: white" class="d-flex flex-column align-center">
    <section-title title="KSRI Governing Body Members" />

    <div class="d-flex justify-center pa-2 ma-2">
      <v-btn
        :color="actionSection === 'Present' ? 'primary' : ''"
        rounded="pill"
        size="large"
        class="mx-2"
        :variant="actionSection === 'Present' ? 'flat' : 'outlined'"
        @click="actionSection = 'Present'"
      >
        Present
      </v-btn>
      <v-btn
        :color="actionSection === 'Past' ? 'primary' : ''"
        :variant="actionSection === 'Past' ? 'flat' : 'outlined'"
        rounded="pill"
        size="large"
        @click="actionSection = 'Past'"
      >
        Past
      </v-btn>
    </div>

    <!-- for all governing body members display heading , their name and subtitle -->
    <div v-if="actionSection === 'Present'">
      <GoverningBody
        :governingBodyMemberKeys="governingBodyMemberKeys"
        :governingBodyMembers="presentGoverningBodyMembers"
      />
    </div>

    <div v-if="actionSection === 'Past'">
      <GoverningBody
        :governingBodyMemberKeys="pastGoverningBodyMemberKeys"
        :governingBodyMembers="pastGoverningBodyMembers"
      />
    </div>
  </div>
</template>

<script setup>
import GoverningBody from "./GoverningBody.vue";

const actionSection = ref("Present");

const presentGoverningBodyMembers = {
  President: [
    {
      name: "Dr. R.K. Raghavan",
      subtitle:
        "(Former Director, Central Bureau of Investigation, New Delhi and Former High commissioner of India to the Republic of Cyprus)",
    },
  ],
  "Vice President": [
    {
      name: "Sri R. Kalidas",
    },
    {
      name: "Justice Mrs. Prabha Sridevan",
    },
  ],
  Secretary: [
    {
      name: "Dr.Sita Sundar Ram",
    },
  ],
  Treasurer: [
    {
      name: "Dr. V. Kameswari",
    },
  ],
  Trustees: [
    {
      name: "Dr. R. Mahadevan",
    },
    {
      name: "Sri D. Suresh",
    },
  ],
  Members: [
    {
      name: "Sri S. Srinivasan",
    },
    {
      name: "Dr. E.R. Rama Bai",
    },
    {
      name: "Dr. R. Krishnamurthy Sastrigal",
    },
    {
      name: "Sri Y. Chandrasekhar",
    },
    {
      name: "Dr. K.S.Balasubramanian",
    },
    {
      name: "Sri Srinath Sridevan",
    },
  ],
};
const governingBodyMemberKeys = Object.keys(presentGoverningBodyMembers);

const pastGoverningBodyMembers = {
  Presidents: [
    {
      name: "Sri T.S. Krishna Murthy",
      startYear: 2015,
      endYear: 2020,
    },
    {
      name: "Dr.N.Mahalingam",
      startYear: 1983,
      endYear: 2015,
    },
    {
      name: "Dr.C.Sivaramamurthi",
      startYear: 1981,
      endYear: 1983,
    },
    {
      name: "Sri.T.V.Viswanatha Iyer",
      startYear: 1975,
      endYear: 1981,
    },
    {
      name: "Dr. (Sir) S.Radhakrishnan",
      startYear: 1953,
      endYear: 1975,
    },
    {
      name: "Sri.T.R.Venkatarama Sastri",
      startYear: 1946,
      endYear: 1953,
    },
    {
      name: "Rt.Hon'ble V.S.Srinivasa Sastri",
      startYear: 1944,
      endYear: 1946,
    },
  ],
  "Vice-Presidents": [
    {
      name: "Sri T.V.Ramanathan",
      startYear: 2011,
      endYear: 2015,
    },
    {
      name: "Mrs.Indira Ramadurai",
      startYear: 1992,
      endYear: 1995,
    },
    {
      name: "Mr.B.Ramamurthi",
      startYear: 1989,
      endYear: 2011,
    },
    {
      name: "Sri A.K.Sivaramakrishnan",
      startYear: 1983,
      endYear: 1990,
    },
    {
      name: "Sri R.Thirumalai",
      startYear: 1983,
      endYear: 1989,
    },
    {
      name: "Sri T.S.Santhanam",
      startYear: 1983,
      endYear: 1989,
    },
    {
      name: "Sri N.C.Krishnan",
      startYear: 1983,
      endYear: 1989,
    },
    {
      name: "Sri T.T.Vasu",
      startYear: 1983,
      endYear: 1989,
    },
    {
      name: "Dr.S.V.Narasimhan",
      startYear: 1983,
      endYear: 2001,
    },
    {
      name: "Dr.R.Nagaswami",
      startYear: 1979,
      endYear: 1983,
    },
    {
      name: "Dr.C.Sivaramamurthi",
      startYear: 1979,
      endYear: 1981,
    },
    {
      name: "Sri T.V.Viswanatha Iyer",
      startYear: 1969,
      endYear: 1975,
    },
    {
      name: "Justice T.L.Venkatarama Aiyar",
      startYear: 1962,
      endYear: 1971,
    },
    {
      name: "Dr. (Sir) A.Lakshmanaswami Mudaliar",
      startYear: 1944,
      endYear: 1974,
    },
    {
      name: "Dr. (Sir) C.P.Ramaswami Iyer",
      startYear: 1944,
      endYear: 1961,
    },
    {
      name: "Dr. (Sir) S.Radhakrishnan",
      startYear: 1944,
      endYear: 1953,
    },
  ],
  Secretaries: [
    {
      name: "Dr.V.Kameswari",
      startYear: 2014,
      endYear: 2016,
    },
    {
      name: "Sri B.Madhavan",
      startYear: 1988,
      endYear: 2014,
    },
    {
      name: "Prof.P.Thirugnanasambandan",
      startYear: 1979,
      endYear: 1989,
    },
    {
      name: "Sri K.Chandrasekharan",
      startYear: 1979,
      endYear: 1988,
    },
    {
      name: "Prof.A.Shanmukha Mudaliar",
      startYear: 1944,
      endYear: 1983,
    },
    {
      name: "Dr.V.Raghavan",
      startYear: 1944,
      endYear: 1979,
    },
    {
      name: "Sri K.Balasubramanya Iyer",
      startYear: 1944,
      endYear: 1970,
    },
  ],
  Treasurers: [
    {
      name: "Dr.Sita Sundar Ram",
      startYear: 2014,
      endYear: 2016,
    },
    {
      name: "Mr.B.Venkataramani",
      startYear: 1989,
      endYear: 2005,
    },
    {
      name: "Sri P.V.Sivarama Dikshitar",
      startYear: 1979,
      endYear: 1983,
    },
    {
      name: "Dr.V.Raghavan",
      startYear: 1962,
      endYear: 1979,
    },
    {
      name: "Sri M.Subbaraya Iyer",
      startYear: 1944,
      endYear: 1962,
    },
  ],
  Trustees: [
    {
      name: "Sri A.G.Sivaramakrishnan",
      startYear: 1983,
      endYear: 1998,
    },
    {
      name: "Sri K.Chandrasekharan",
      startYear: 1963,
      endYear: 1988,
    },
    {
      name: "Sri T.V.Viswanatha Iyer",
      startYear: 1963,
      endYear: 1981,
    },
    {
      name: "Rao Bahadur K.V.Krishnaswami Iyer",
      startYear: 1944,
      endYear: 1965,
    },
    {
      name: "Rao Bahadur A.A.Venkatarama Iyer",
      startYear: 1944,
      endYear: 1962,
    },
  ],
  Members: [
    {
      name: "Dr.N.Balasubramanian",
      startYear: 2001,
      endYear: 2019,
    },
    {
      name: "Smt.T.V.Savithri",
      startYear: 1992,
      endYear: 2012,
    },
    {
      name: "Dr.C.S.Sundaram",
      startYear: 1992,
      endYear: 2011,
    },
    {
      name: "Dr.K.K.Raja",
      startYear: 1992,
      endYear: 2005,
    },
    {
      name: "Sri M.Ganapathi",
      startYear: 1989,
      endYear: 1999,
    },
    {
      name: "Dr.S.S.Janaki",
      startYear: 1983,
      endYear: 1999,
    },
    {
      name: "Smt.Indira Ramadurai",
      startYear: 1983,
      endYear: 1992,
    },
    {
      name: "Sri P.V.Sivarama Dikshitar",
      startYear: 1983,
      endYear: 1992,
    },
    {
      name: "Dr.N.Veezhinathan",
      startYear: 1979,
      endYear: 1983,
    },
    {
      name: "Dr.K.K.Raja",
      startYear: 1979,
      endYear: 1983,
    },
    {
      name: "Sri R.Rangachari",
      startYear: 1962,
      endYear: 1983,
    },
    {
      name: "Sri M.M.Gurunath",
      startYear: 1962,
      endYear: 1981,
    },
    {
      name: "Sri D.Ramalinga Reddy",
      startYear: 1962,
      endYear: 1978,
    },
    {
      name: "Sri T.V.Viswanatha Iyer",
      startYear: 1951,
      endYear: 1962,
    },
    {
      name: "Sri T.K.Rajagopala Iyer",
      startYear: 1951,
      endYear: 1956,
    },
    {
      name: "Sri N.Raghunatha Iyer",
      startYear: 1944,
      endYear: 1982,
    },
    {
      name: "Dewan Bahadur K.S.Ramaswami Sastri",
      startYear: 1944,
      endYear: 1969,
    },
    {
      name: "Rao Bahadur Prof.D.S.Sarma",
      startYear: 1944,
      endYear: 1969,
    },
    {
      name: "Prof.P.N.Srinivasachariar",
      startYear: 1944,
      endYear: 1956,
    },
    {
      name: "Prof.T.Chandrasekharan",
      startYear: 1944,
      endYear: 1951,
    },
    {
      name: "Rao Bahadur G.A.Natesan",
      startYear: 1944,
      endYear: 1949,
    },
  ],
};

const pastGoverningBodyMemberKeys = Object.keys(pastGoverningBodyMembers);

const updateActiveSection = (section) => {
  actionSection.value = section;
};
</script>
