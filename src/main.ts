import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import Lucide icons
import {
  Award, ArrowRight, Play, Video, BookOpen, Shield, Users, Download, Lock,
  Clock, CheckCircle, Heart, Monitor, UserCheck, Mail, X, Menu, ShieldCheck, User
} from 'lucide-vue-next';

const app = createApp(App);

// Register Lucide icons globally
app.component('AwardIcon', Award);
app.component('ArrowRightIcon', ArrowRight);
app.component('PlayIcon', Play);
app.component('VideoIcon', Video);
app.component('BookOpenIcon', BookOpen);
app.component('ShieldIcon', Shield);
app.component('UsersIcon', Users);
app.component('DownloadIcon', Download);
app.component('LockIcon', Lock);
app.component('ClockIcon', Clock);
app.component('CheckCircleIcon', CheckCircle);
app.component('HeartIcon', Heart);
app.component('MonitorIcon', Monitor);
app.component('UserCheckIcon', UserCheck);
app.component('MailIcon', Mail);
app.component('XIcon', X);
app.component('MenuIcon', Menu);
app.component('ShieldCheckIcon', ShieldCheck);
app.component('UserIcon', User);

app.use(router);
app.mount('#app');
