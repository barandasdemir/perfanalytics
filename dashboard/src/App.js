import './App.css';
import 'bulma/css/bulma.min.css';
import { Container, Navbar, Heading } from 'react-bulma-components';
import WebsiteTable from './Components/WebsiteTable';

function App() {
  return (
    <Container className="App" pt="3">
      <Navbar color="primary" colorVariant="dark" size="large">
        <Navbar.Brand>
          <Heading textColor="white">PerfAnalytics Dashboard</Heading>
        </Navbar.Brand>
      </Navbar>

      <Heading mt="6" textColor="white">
        Connected websites
      </Heading>

      <WebsiteTable />
    </Container>
  );
}

export default App;
