import { useEffect, useState } from "react"
import Product from "../components/Product";
import { initMongoose } from "../lib/mongoose";
import { findAllProducts } from "./api/products";
import Footer from "../components/Footer";
import Layout from "../components/Layout";

export default function Home({products}) {
  const [phrase,setPhrase] = useState('');

  // Not needed since we are not fetching the ProductsInfo from API instead fetching from ServerSideProps which is faster
  // const [productsInfo,setProductsInfo] = useState([]);
  // useEffect(() => {
  //   fetch('/api/products')
  //   .then(response => response.json())
  //   .then(json => setProductsInfo(json));
  // },[]);
  // console.log({productsInfo});

  const categoriesNames = [...new Set(products.map(p => p.category))];
  // console.log({categoriesNames});

  if (phrase) {
    const lowerCasePhrase = phrase.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(lowerCasePhrase));
  }

  return (
    <Layout>
      <input value={phrase} onChange={e => setPhrase(e.target.value)} type="text" placeholder="Search for products..." className="bg-gray-100 w-full py-2 px-4 rounded-xl"/>
      <div>
        {categoriesNames.map(categoryName => (
          <div key={categoryName}>
            {products.find(p => p.category === categoryName) && (
              <div>
                <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  {products.filter(p => p.category === categoryName).map(productInfo => (
                    <div key={productInfo._id} className="px-5 snap-start">
                      <Product {...productInfo} />
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
        ))}
      </div>

    </Layout>
  )
}

export async function getServerSideProps() {
  await initMongoose();
  const products = await findAllProducts();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}