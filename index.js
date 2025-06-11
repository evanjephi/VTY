import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler'; // <-- MUST be first!
import App from './app';

registerRootComponent(App);