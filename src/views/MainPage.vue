<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Fire Guard Plus Талоны</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Fire Guard Plus Талоны</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container"></div>
      <div>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Отправка талона</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-input
              v-model="description"
              type="text"
              placeholder="Введите описание проблемы"
            ></ion-input>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-list>
            <ion-list-header>
              <ion-card-title>Выберите время записи:</ion-card-title>
            </ion-list-header>
            <ion-item v-for="ticket in tickets" :key="ticket.id">
              <ion-chip
                :disabled="!!ticket.applicationId"
                color="danger"
                id="present-alert"
                @click="addApplication(ticket)"
                >{{
                  ticket?.date.toString().split("T")[0].replaceAll("-", " ") +
                  " " +
                  ticket?.date.toString().split("T")[1].split(".")[0]
                }}
              </ion-chip>
            </ion-item>
          </ion-list>
        </ion-card>
      </div>
      <!---->
      <!-- <ion-button expand="block" @click="setOpen(true)">Open</ion-button> -->

      <!---->

      <ion-alert
        :is-open="isAlertOpen"
        header="Ваша заявка в обработке"
        :buttons="alertButtons"
        @didDismiss="isAlertOpen = false"
      ></ion-alert>
    </ion-content>
    <ion-footer>
      <ion-grid>
        <ion-row>
          <!-- <ion-col>
            <ion-button tab="home">
              <ion-label>Записаться</ion-label>
            </ion-button>
          </ion-col> -->
          <ion-col>
            <ion-button @click="isModalOpen = true">
              <ion-label>Мои записи</ion-label>
            </ion-button>
            <ion-button @click="logout">
              <ion-label>Выйти</ion-label>
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
    <!---->
    <ion-modal :is-open="isModalOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Записи</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-card
          v-for="application in myApplications"
          :key="application?.id"
          :color="application?.refusedDescription ? 'danger' : ''"
        >
          <ion-card-header>
            <ion-card-title>{{
              application?.filling
                .toString()
                .replaceAll("-", " ")
                .replaceAll("T", "/")
                .slice(0, 16)
            }}</ion-card-title>
            <ion-card-subtitle
              ><b>Статус:</b
              >{{
                " " + localizeStatus(application?.status ?? "open")
              }}</ion-card-subtitle
            >
            <ion-card-subtitle v-if="application?.refusedDescription"
              ><b>{{ application?.refusedDescription }}</b></ion-card-subtitle
            >
          </ion-card-header>
          <ion-card-content> {{ application?.description }} </ion-card-content>
        </ion-card>
        <!-- <ion-card>
          <ion-card-header>
            <ion-card-title>2024/05/22 15:28:37</ion-card-title>
            <ion-card-subtitle><b>Статус:</b> Открыта</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content> Поломка датчика задымления </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-title>2024/05/26 11:39:48</ion-card-title>
            <ion-card-subtitle><b>Статус:</b> Открыта</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content> Оплавление проводки </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-title>2024/05/26 12:18:15</ion-card-title>
            <ion-card-subtitle><b>Статус:</b> Открыта</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content> Отказ оборудования </ion-card-content>
        </ion-card> -->
      </ion-content>
      <ion-footer>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-button @click="isModalOpen = false">
                <ion-label>Талоны</ion-label>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-footer>
    </ion-modal>
    <ion-toast
      :is-open="dangetToast"
      message="Необходимо указать описание проблемы"
      :duration="3000"
      @didDismiss="dangetToast = false"
    >
    </ion-toast>
  </ion-page>
</template>

<script setup lang="ts">
import { Ticket, getTickets } from "@/api/tickets";
import { accessToken } from "@/utils";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonChip,
  IonInput,
  IonAlert,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonModal,
  IonButton,
  IonList,
  IonListHeader,
  IonToast,
  useIonRouter,
} from "@ionic/vue";
import { onMounted, ref, Ref } from "vue";
import { addApplication as addApplicationApi } from "@/api/applications";
import { API_STR, AUTH_TYPE } from "@/api/auth";

interface Application {
  id: number;
  filling: Date;
  senderId: number;
  description: string;
  status: string;
  specialist: string;
  refusedDescription: string;
}

const alertButtons = ["Ок"];

const router = useIonRouter();

const tickets: Ref<Ticket[]> = ref([]);
const description: Ref<string> = ref("");
const isAlertOpen: Ref<boolean> = ref(false);
const isModalOpen: Ref<boolean> = ref(false);
const myApplications: Ref<Application[] | undefined> = ref();
const dangetToast: Ref<boolean> = ref(false);

onMounted(async () => {
  router.replace;
  tickets.value = await getTickets(accessToken.value);
  await getMyApplications();
});

const addApplication = async (ticket: Ticket) => {
  console.log(description.value);
  if (description.value === "") {
    dangetToast.value = true;
    return;
  }
  await addApplicationApi(description.value, ticket, accessToken.value);
  tickets.value = await getTickets(accessToken.value);
  description.value = "";
  isAlertOpen.value = true;
};

const getMyApplications = async () => {
  const headers = new Headers();
  headers.append("authorization", `${AUTH_TYPE} ${accessToken.value}`);

  try {
    const response = await fetch(`${API_STR}/applications/my`, {
      method: "GET",
      headers: headers,
      redirect: "follow",
    });
    const result = await response.json();
    console.log(result);
    myApplications.value = result;
  } catch (error) {
    console.error(error);
  }
};

const localizeStatus = (status: string) => {
  if (status === "open") return "Открыто";
  if (status === "inProcess") return "В работе";
  if (status === "closed") return "Закрыто";
  if (status === "refused") return "Отклонено";
};

const logout = () => {
  router.push("/home");
};
</script>

<style scoped>
ion-col {
  text-align: center;
}

#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.mg-10 {
  margin: 10px;
}
</style>
