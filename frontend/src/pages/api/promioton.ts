import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  // Esegui la richiesta all'API endpoint per ottenere i dati
  const response = await fetch("http://localhost:8080/data");
  const data = await response.json();
  console.log("___________________");
  console.log("data", data);
  console.log("___________________");
  // Passa i dati come props alla pagina
  return {
    props: {
      conadPromotion: data.conad_promotion,
    },
  };
};
