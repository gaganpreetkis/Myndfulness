package app.myndfulness;
import expo.modules.devmenu.react.DevMenuAwareReactActivity;
import android.content.Intent;
import expo.modules.devlauncher.DevLauncherController;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

import expo.modules.ReactActivityDelegateWrapper;
import expo.modules.splashscreen.SplashScreenImageResizeMode;
import expo.modules.splashscreen.singletons.SplashScreen;

public class MainActivity extends DevMenuAwareReactActivity {

  @Override
  public void onNewIntent(Intent intent) {
      if (DevLauncherController.tryToHandleIntent(this, intent)) {
         return;
      }
      super.onNewIntent(intent);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support 
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
      SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView.class, false);
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

}
