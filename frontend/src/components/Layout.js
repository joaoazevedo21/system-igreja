import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {

  return (

    <div>

      <Sidebar />

      <div style={styles.main}>

        <Header />

        <div style={styles.content}>
          {children}
        </div>

      </div>

    </div>

  );

}

const styles = {

  main: {
    marginLeft: "0px"
  },

  content: {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh"
  }

};

export default Layout;