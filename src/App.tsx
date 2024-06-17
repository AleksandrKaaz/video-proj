import React from 'react';
import Container from './components/Container';
import { observer } from 'mobx-react';

const App: React.FC = () => {
  return <Container />;
};

export default observer(App);
