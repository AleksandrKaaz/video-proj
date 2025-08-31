import React from 'react';
import Container from './components/Container';
import { observer } from 'mobx-react';
import { Provider } from 'react-redux';
import { store } from './stores/redux/reduxTimestampStore';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
};

export default observer(App);
