<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Modusplus</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Modusplus</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-input v-model="login" placeholder="Введите логин" type="text" />
        <ion-input
          v-model="password"
          placeholder="Введите пароль"
          type="password"
        />
        <ion-button @click="signIn">Войти</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  useIonRouter,
} from "@ionic/vue";
import { ref } from "vue";
import { accessToken } from "../utils";
import { signIn as signInApi } from "../api/auth";

const router = useIonRouter();
const login = ref("");
const password = ref("");

const signIn = async () => {
  const token = await signInApi(login.value, password.value);
  if (!token) return;
  accessToken.value = token;
  router.push("/main");
};
</script>

<style scoped>
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
</style>
