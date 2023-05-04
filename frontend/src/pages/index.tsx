import { NextPage } from "next";
import { Promotion } from "@/types/data_scraper_types";
import { GetServerSideProps } from "next";

type Props = {
  conadPromotion: Promotion[];
};

const Home: NextPage<Props> = ({ conadPromotion }) => {
  return (
    <div>
      <h1>Promozione Conad</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {conadPromotion?.map((data) => (
          <div
            key={data.name}
            className="border border-gray-200 rounded-lg shadow-md"
          >
            <div>{data.name}</div>
            <img
              src={data.img}
              alt={data.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <p className="text-lg font-medium text-gray-800">{data.price}</p>
              <p className="text-sm text-gray-500">{data.validity}</p>
              <p className="text-sm text-gray-500">{data.promotion}</p>
              <p className="text-sm text-gray-500">{data.unitCost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
