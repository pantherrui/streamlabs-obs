import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import TopNav from '../TopNav.vue';
import NewsBanner from '../NewsBanner.vue';
import { ScenesService } from 'services/scenes';

// Pages
import Studio from '../pages/Studio.vue';
import Dashboard from '../pages/Dashboard.vue';
import Chatbot from '../pages/Chatbot.vue';
import BrowseOverlays from 'components/pages/BrowseOverlays.vue';
import Live from '../pages/Live.vue';
import Onboarding from '../pages/Onboarding.vue';
import TitleBar from '../TitleBar.vue';
import { Inject } from '../../util/injector';
import { CustomizationService } from 'services/customization';
import { NavigationService } from 'services/navigation';
import { AppService } from 'services/app';
import { UserService } from 'services/user';
import { WindowsService } from 'services/windows';
import LiveDock from '../LiveDock.vue';
import StudioFooter from '../StudioFooter.vue';
import CustomLoader from '../CustomLoader.vue';
import PatchNotes from '../pages/PatchNotes.vue';
import DesignSystem from '../pages/DesignSystem.vue';
import electron from 'electron';

@Component({
  components: {
    TitleBar,
    TopNav,
    Studio,
    Dashboard,
    BrowseOverlays,
    Live,
    Onboarding,
    LiveDock,
    StudioFooter,
    CustomLoader,
    PatchNotes,
    NewsBanner,
    Chatbot,
    DesignSystem,
  }
})
export default class Main extends Vue {
  @Inject() customizationService: CustomizationService;
  @Inject() navigationService: NavigationService;
  @Inject() appService: AppService;
  @Inject() userService: UserService;
  @Inject() windowsService: WindowsService;
  @Inject() scenesService: ScenesService;

  mounted() {
    electron.remote.getCurrentWindow().show();
  }

  get title() {
    return this.windowsService.state.main.title;
  }

  get page() {
    return this.navigationService.state.currentPage;
  }

  get params() {
    return this.navigationService.state.params;
  }

  get nightTheme() {
    return this.customizationService.nightMode;
  }

  get applicationLoading() {
    return this.appService.state.loading;
  }

  get isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  get leftDock() {
    return this.customizationService.state.leftDock;
  }

  get isOnboarding() {
    return this.navigationService.state.currentPage === 'Onboarding';
  }

  /**
   * Only certain pages get locked out while the application
   * is loading.  Other pages are OK to keep using.
   */
  get shouldLockContent() {
    return (
      this.applicationLoading &&
      (this.navigationService.state.currentPage === 'Studio' ||
        this.navigationService.state.currentPage === 'Live')
    );
  }

  onDropHandler(event: DragEvent) {
    const files = event.dataTransfer.files;

    let fi = files.length;
    while (fi--) {
      const file = files.item(fi);
      this.scenesService.activeScene.addFile(file.path);
    }
  }
}
