<template>
  <div class="mx-2 my-8">
    <div class="text-center mx-4">
      <LibraryHeader />

      <div class="text-h4 font-weight-bold" data-aos="fade-up">Overview</div>

      <div
        class="text-h6 my-4 text-start"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        The Library is comprised of nearly 60,000 books authored by great and
        popular writers on variety of Sanskrit and Indological subjects like
        Dance and Music, Epigraphy, Ethics, Law, Language and Literature,
        Philosophy and Ayurveda. These books are in varied languages like in
        Sanskrit, Tamil, Telugu, Kannada, Malayalam, English, German and French.
        Besides books the library has journals and back volumes. The collection
        has received and continues generous donations of books.
      </div>

      <v-card
        class="my-4"
        color="greenBg"
        elevation="0"
        data-aos="zoom-in"
        data-aos-delay="400"
      >
        <v-img
          src="https://d30y75l38k1y9.cloudfront.net/upload/library-secton-800x.jpg"
          cover
        ></v-img>
        <div class="text-h6 text-start ma-2">
          Similarly, the Institute also has a large collection of noteworthy
          palm-leaf Manuscripts written in Grantha, Malayalam, Telugu, Tamil,
          Nandinagari, Tihilari scripts. These manuscripts contain material
          related to Vedas, Epics, Srauta, Dharmasutras, Philosophy, Literature
          etc., special mention may be made of Manuscripts written in
          Manipravala style. The Library also holds the Xerox copies of the
          Manuscripts on Tala presented by Dr.Robert E. Brown, San Diego State
          University, USA.
        </div>
      </v-card>

      <div class="my-8">
        <div class="text-h4 font-weight-bold my-8" data-aos="fade-up">
          Preservation of Manuscripts and Books
        </div>
        <v-card
          class="text-h5 libraryRack d-flex justify-center align-center"
          :class="$device.isMobile ? '' : 'mx-6'"
          width="100%"
          :height="$device.isMobile ? '' : '70vh'"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div class="">
            <v-card
              color="secondary my-16 pa-4"
              elevation="0"
              rounded="0"
              :width="$device.isMobile ? '' : '70vw'"
              data-aos="fade-right"
              data-aos-delay="900"
              :class="$device.isMobile ? 'mx-2' : ''"
            >
              The Manuscript collection is being systematically preserved by
              adopting periodical manual cleaning , kept separately in an Air
              conditioned stack room.
            </v-card>
            <v-card
              color="primary my-16 pa-4"
              :class="$device.isMobile ? 'mx-2' : ''"
              elevation="0"
              rounded="0"
              :width="$device.isMobile ? '' : '70vw'"
              data-aos="fade-left"
              data-aos-delay="900"
            >
              Recently the library has adopted the new system called Photolam
              System. Under this system so far 1500 books were restored to their
              original shape.
            </v-card>
          </div>
        </v-card>
      </div>
    </div>

    <div class="mx-2 my-8">
      <div class="sectionSubtitle my-4" data-aos="fade-up" data-aos-delay="200">
        Human Resources
      </div>
      <div
        class="imageWithTextAlignedToRight"
        style="height: 50vh"
        v-if="!$device.isMobile"
      >
        <div>
          <v-img
            src="https://d30y75l38k1y9.cloudfront.net/upload/grantha-manuscript.jpg"
            cover
            height="50vh"
            width="50vw"
            data-aos="fade-right"
            data-aos-delay="900"
          >
          </v-img>
        </div>
        <div
          class="text-h6 textOverlay pa-4 text-white"
          data-aos="fade-left"
          data-aos-delay="900"
        >
          The Kuppuswami Sastri Research Institute's Library is a Closed Access
          system with its own special classification of subjects as it is a
          special library dealing with books specifically on Sanskrit and
          Indological studies. The library staff are trained in maintaining and
          preserving by adopting the new techniques. The academic staff of the
          Institute help the readers in understanding the texts and suggest
          books for further studies.
        </div>
      </div>

      <!-- for mobile: image in bg on 1st card and text in 2nd card aligned to center -->
      <v-card
        class="my-4"
        color="greenBg"
        elevation="0"
        data-aos="zoom-in"
        data-aos-delay="400"
        v-if="$device.isMobile"
      >
        <v-img
          src="https://d30y75l38k1y9.cloudfront.net/upload/grantha-manuscript.jpg"
          cover
        ></v-img>
        <div
          class="text-h6 text-start ma-2"
          data-aos="fade-up"
          data-aos-delay="900"
        >
          The Kuppuswami Sastri Research Institute's Library is a Closed Access
          system with its own special classification of subjects as it is a
          special library dealing with books specifically on Sanskrit and
          Indological studies. The library staff are trained in maintaining and
          preserving by adopting the new techniques. The academic staff of the
          Institute help the readers in understanding the texts and suggest
          books for further studies.
        </div>
      </v-card>
    </div>

    <div class="mx-2 my-8">
      <div class="sectionSubtitle my-4" data-aos="fade-up" data-aos-delay="500">
        Focus on Digitization of Mss. and Rare Books
      </div>
      <div
        class="imageWithTextAlignedToRight"
        style="height: 50vh"
        v-if="!$device.isMobile"
      >
        <v-img
          data-aos="fade-right"
          data-aos-delay="900"
          class="imgOnRight"
          src="https://d30y75l38k1y9.cloudfront.net/upload/library-focus.jpg"
          cover
          height="50vh"
          width="50vw"
        >
        </v-img>
        <v-card
          class="text-h6 textOverlayRight pa-4"
          rounded="0"
          elevation="4"
          data-aos="fade-left"
          data-aos-delay="900"
        >
          Realising the importance of the collection, the Institute is trying to
          digitize the old books (70- 100 years old) and the Manuscripts. Under
          the Millennium Project envisaged by the former President Dr.A.P.J.
          Abdul Kalam, the Tirumala Tirupati Devasthanam has digitalized nearly
          3000 books published before 1950 on various subjects.
        </v-card>
      </div>

      <!-- for mobile -->
      <v-card
        class="my-4"
        color="greenBg"
        elevation="0"
        data-aos="zoom-in"
        data-aos-delay="400"
        v-if="$device.isMobile"
      >
        <v-img
          src="https://d30y75l38k1y9.cloudfront.net/upload/library-focus.jpg"
          cover
        ></v-img>
        <div
          class="text-h6 text-start ma-2"
          data-aos="fade-up"
          data-aos-delay="900"
        >
          Realising the importance of the collection, the Institute is trying to
          digitize the old books (70- 100 years old) and the Manuscripts. Under
          the Millennium Project envisaged by the former President Dr.A.P.J.
          Abdul Kalam, the Tirumala Tirupati Devasthanam has digitalized nearly
          3000 books published before 1950 on various subjects.
        </div>
      </v-card>
    </div>

    <v-card
      class="mx-2 my-8"
      color="primary"
      rounded="0"
      elevation="0"
      data-aos="fade-up"
    >
      <div
        class="sectionSubtitle my-8"
        data-aos="fade-right"
        data-aos-delay="900"
      >
        Workshop
      </div>
      <v-card
        class="mx-8 text-h6 pa-4"
        color="secondary"
        rounded="0"
        elevation="0"
        data-aos="fade-left"
        data-aos-delay="900"
      >
        In collaboration with the Govt. Museum, Madras, the K.S.R.I. Library
        conducted a 3 days Workshop on "Preventive Conservation of Manuscripts"
        from Aug.30th to Sept.1, 2006. It was well attended by the staff,
        students from different parts expecially from the Institute of Indian
        Medicine (Siddha), Chennai, and Tamil University,Thanjavur.
      </v-card>
    </v-card>

    <v-card
      class="mx-2 my-8"
      color="primary"
      rounded="0"
      elevation="0"
      data-aos="fade-up"
    >
      <div
        class="sectionSubtitle my-4"
        data-aos="fade-right"
        data-aos-delay="900"
      >
        Training Programmes
      </div>
      <v-card
        class="mx-8 my-8 text-h6 pa-4"
        color="accentGreen"
        rounded="0"
        data-aos="fade-left"
        data-aos-delay="900"
      >
        Training Programmes The staff of the KSRI Library attended internship
        training programmes, workshops conducted by the Govt. Museum, Chennai,
        C.P.Ramaswamy Iyer Foundation, Chennai and Govt. of Archaeology,
        Trivandrum.
      </v-card>
    </v-card>

    <div>
      <div class="sectionSubtitle my-4" data-aos="fade-up" data-aos-delay="200">
        Services
      </div>
      <div>
        <v-row>
          <v-col
            v-for="(service, index) in services"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            class="d-flex flex-column justify-space-around align-center text-center services pa-8"
            data-aos="fade-up"
            :data-aos-delay="index * 200 + 900"
          >
            <div class="text-h6 text-accentGreen">{{ index + 1 }}.</div>
            <div class="text-h6 my-4">
              {{ service }}
            </div>
            <v-divider
              class="my-4 mx-auto"
              width="50px"
              thickness="3px"
              color="green"
            />
          </v-col>
        </v-row>
      </div>
    </div>

    <v-card
      elevation="0"
      rounded="0"
      height="50vh"
      class="supportBg d-flex flex-column justify-center"
      data-aos="fade-up"
      data-aos-delay="500"
    >
      <v-card color="secondary" class="pa-4 text-center my-5" rounded="0">
        <div
          class="text-h3 font-weight-bold my-4"
          data-aos="fade-right"
          data-aos-delay="900"
        >
          Support
        </div>
        <div class="text-h6" data-aos="fade-left" data-aos-delay="900">
          Mainly through donations provided by the philanthropists, scholars and
          lovers of Sanskrit and culture in and around India and also abroad.
        </div>
      </v-card>

      <div class="text-center my-5" data-aos="fade-up" data-aos-delay="900">
        <v-btn rounded="pill" class="text-secondary" size="large"
          >Contribute</v-btn
        >
      </div>
    </v-card>

    <div
      class="text-center mx-auto d-flex flex-column justify-center"
      :style="$device.isMobile ? '' : 'width: 70vw; margin: 0 auto;'"
    >
      <div class="sectionSubtitle my-4" data-aos="fade-up" data-aos-delay="200">
        Requirements
      </div>
      <div class="text-h6 my-8" data-aos="fade-up" data-aos-delay="400">
        The present problem is to preserve these books in proper condition since
        they have become unbound and are in bad condition in the process of
        handling them for digitalization. The books being more than 70 years
        old, some even 120 years old ordinary binding cannot be carried out to
        preserve them in proper condition. We have been advised by the officials
        of the Tamilnadu Archives and Govt. Museum to adopt a new system called
        Photolam System which is quite costly.
      </div>
    </div>
  </div>
</template>

<script setup>
import LibraryHeader from "./LibraryHeader.vue";

const services = [
  "Reprographic services and online services are provided also institutional assistance.",
  "60% of our catalogue can be accessed through our Website : www.ksrisanskrit.in",
  "Separate reading room for researchers for their research.",
  "Extensive research materials including special Encyclopaedias, Descriptive Catalogues of Manuscripts in various libraries all over the world, and general reference materials are also available.",
  "The Library is open from 10.00 a.m. to 5.00 p.m. on all days except second Saturdays and Sundays and Government Holidays.",
  "Members: Enrollment as Patrons, Fellows, Life and Reader and Borrowing Membership.",
];
</script>

<style scoped>
.libraryRack {
  background-image: url(https://d30y75l38k1y9.cloudfront.net/upload/library-racks.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* imageWithTextAlignedToRight and textOverlay: make textOverlay appear on top of image 30% above image*/
.imageWithTextAlignedToRight {
  position: relative;
}

.textOverlay {
  background-color: #bf641f;
  position: absolute;
  top: 30%;
  left: 20%;
}

.imgOnRight {
  position: absolute;
  top: 0;
  right: 0;
}

.textOverlayRight {
  position: absolute;
  top: 30%;
  right: 20%;
}

.services {
  border: 1px solid rgb(9, 52, 28, 0.1);
}

.supportBg {
  background-image: url(https://d30y75l38k1y9.cloudfront.net/upload/support.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
