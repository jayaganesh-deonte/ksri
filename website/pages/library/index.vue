<template>
  <div class="mx-2 my-8">
    <div class="text-center mx-4">
      <LibraryHeader />

      <div class="text-h4 font-weight-bold" data-aos="fade-up">Overview</div>

      <div
        class="sectionBody my-4 text-start"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        The Library is comprised of nearly 65,000 books authored by great and
        popular writers on variety of Sanskrit and Indological subjects like
        Dance and Music, Epigraphy, Ethics, Law, Language and Literature,
        Philosophy and Ayurveda. These books are in varied languages like in
        Sanskrit, Tamil, Telugu, Kannada, Malayalam, English, German and French.
        Besides books the library has journals and back volumes.
      </div>

      <v-card
        class="my-4"
        color="greenBg"
        elevation="0"
        data-aos="zoom-in"
        data-aos-delay="200"
      >
        <v-img
          :src="getAssetUrl('upload/library-secton-800x.jpg')"
          cover
        ></v-img>
        <div class="sectionBody text-start ma-2">
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
          class="text-h5 libraryRack font-weight-bold d-flex justify-center align-center"
          :class="$device.isMobile ? '' : 'mx-6'"
          width="100%"
          data-aos="fade-up"
          data-aos-delay="200"
          rounded="0"
        >
          <div class="text-justify">
            <v-card
              color="secondary my-16 pa-8"
              elevation="0"
              rounded="0"
              :max-width="$device.isMobile ? '' : '40vw'"
              data-aos="fade-right"
              data-aos-delay="900"
              :class="$device.isMobile ? 'mx-2' : ''"
            >
              The Manuscript collection is being systematically preserved by
              adopting periodical manual cleaning , kept separately in an Air
              conditioned stack room.
            </v-card>
            <v-card
              color="primary my-16 pa-8"
              :class="$device.isMobile ? 'mx-2' : ''"
              elevation="0"
              rounded="0"
              :max-width="$device.isMobile ? '' : '40vw'"
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
      <v-row class="d-flex" v-if="!$device.isMobile">
        <v-col class="ma-0 pa-0">
          <div>
            <v-img
              src="/img/library/library-racks-4.jpg"
              cover
              data-aos="fade-right"
              data-aos-delay="900"
            >
            </v-img>
          </div>
        </v-col>
        <v-col class="ma-0 pa-0">
          <v-card
            height="100%"
            elevation="0"
            rounded="0"
            class="sectionBody text-justify pa-4 text-h6 font-weight-bold text-white d-flex justify-center align-center"
            data-aos="fade-left"
            data-aos-delay="900"
            style="background-color: #bf641f"
          >
            <div>
              The Kuppuswami Sastri Research Institute's Library is a Closed
              Access system with its own special classification of subjects as
              it is a special library dealing with books specifically on
              Sanskrit and Indological studies. The library staff are trained in
              maintaining and preserving by adopting the new techniques. The
              academic staff of the Institute help the readers in understanding
              the texts and suggest books for further studies.
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- for mobile: image in bg on 1st card and text in 2nd card aligned to center -->
      <v-card
        class="my-4"
        color="greenBg"
        elevation="0"
        data-aos="zoom-in"
        data-aos-delay="200"
        v-if="$device.isMobile"
      >
        <v-img src="/img/library/library-racks-4.jpg" cover></v-img>
        <div class="sectionBody ma-2" data-aos="fade-up" data-aos-delay="900">
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
        class="mx-auto sectionBody pa-4 ma-4"
        width="50vw"
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
        class="mx-auto sectionBody pa-4 ma-4"
        width="50vw"
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

    <div class="d-flex flex-column justify-center align-center">
      <div class="sectionSubtitle mt-4" data-aos="fade-up" data-aos-delay="200">
        Services
      </div>
      <v-card
        elevation="0"
        rounded="0"
        class="my-2"
        :width="$device.isMobile ? '' : '60vw'"
      >
        <v-card-text>
          <div v-for="(service, index) in services" :key="index">
            <div
              class="sectionBody my-4 text-primary font-weight-bold"
              v-html="service"
            />
          </div>
        </v-card-text>
      </v-card>
      <!-- <div>
        <v-row>
          <v-col
            v-for="(service, index) in services"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            class="d-flex flex-column justify-space-around align-center text-center services pa-8"
            data-aos="fade-up"
            :data-aos-delay="index * 300"
          >
            <div class="sectionBody">❖</div>
            <div class="sectionBody my-4" v-html="service" />
            <v-divider
              class="my-4 mx-auto"
              width="50px"
              thickness="3px"
              color="green"
            />
          </v-col>
        </v-row>
      </div> -->
    </div>

    <v-card
      elevation="0"
      rounded="0"
      height="40vh"
      class="supportBg d-flex flex-column justify-center"
      data-aos="fade-up"
      data-aos-delay="500"
    >
    </v-card>
    <v-card color="secondary" class="pa-3 text-center" rounded="0">
      <div
        class="text-h3 font-weight-bold"
        data-aos="fade-right"
        data-aos-delay="900"
      >
        Support
      </div>
      <!-- <div class="sectionBody" data-aos="fade-left" data-aos-delay="900">
        Mainly through donations provided by the philanthropists, scholars and
        lovers of Sanskrit and culture in and around India and also abroad.
      </div> -->
    </v-card>
    <div
      class="text-center mx-auto d-flex flex-column justify-center"
      :style="$device.isMobile ? '' : 'width: 70vw; margin: 0 auto;'"
    >
      <!-- <div class="sectionSubtitle my-4" data-aos="fade-up" data-aos-delay="200">
        Requirements
      </div> -->
      <div class="sectionBody my-8" data-aos="fade-up" data-aos-delay="200">
        The present problem is to preserve these books in proper condition since
        they have become unbound and are in bad condition in the process of
        handling them for digitization. The books being more than 70 years old,
        some even 120 years old ordinary binding cannot be carried out to
        preserve them in proper condition. We have been advised by the officials
        of the Tamilnadu Archives and Govt. Museum to adopt a new system called
        Photolam System which is quite costly. The implementation of this system
        is mainly possible through the donations provided by the
        philanthropists, scholars and lovers of Sanskrit and culture in and
        around India and also abroad.
      </div>
      <div class="d-flex align-center justify-center pa-4">
        <div
          class="font-weight-bold text-h5 my-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Kindly contribute for a noble cause.
        </div>
        <div class="text-center mx-5" data-aos="fade-up" data-aos-delay="200">
          <v-btn
            rounded="pill"
            size="large"
            color="primary"
            :to="'/payment/donation/'"
            >Contribute</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LibraryHeader from "./LibraryHeader.vue";

const services = [
  "❖ Reprographic services are provided by the Library.",
  "❖ 60% of our catalogue can be accessed through our Website : <a href='/library/books' style='text-decoration: unset;'>www.ksri.in/library/books</a> .",
  "❖ Separate reading room for researchers for their research.",
  "❖ Extensive research materials including special Encyclopaedias, Descriptive Catalogues of Manuscripts in various libraries all over the world, and general reference materials are also available.",
  "❖ The Library is open from 10.00 a.m. to 5.00 p.m. on all days except second Saturdays and Sundays and Government Holidays.",
  "❖ Members: Enrollment as Patrons, Fellows, Life and Reader and Borrowing Membership.",
];

const getAssetUrl = (url) => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.ASSET_DOMAIN + url;
};
</script>

<style>
.libraryRack {
  background-image: url("/img/library/library-racks-1.jpg");
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
  background-image: url("/img/library/library-racks-3.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
