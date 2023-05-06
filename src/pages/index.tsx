import { GetServerSideProps, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";

import { HomeContainer, Product } from "@/styles/pages/home";
import { priceFormatter } from "@/utils/formatter";
import { stripe } from "@/lib/stripe";
import { Stripe } from "stripe";

import "keen-slider/keen-slider.min.css";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home(props: HomeProps) {
  const { products } = props;
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });
  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => {
        return (
          // prefetch false, evita que o next carregue a página para o onde o link leva
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            prefetch={false}
          >
            <Product className="keen-slider__slide">
              <Image
                src={product.imageUrl}
                width={520}
                height={480}
                alt="product-image"
              />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        );
      })}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = data.map((product) => {
    const price = product.default_price as Stripe.Price;

    const checkedPrice = price.unit_amount
      ? priceFormatter(price.unit_amount / 100)
      : 0;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: checkedPrice,
    };
  });
  return {
    props: { products },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const { data } = await stripe.products.list({
//     expand: ["data.default_price"],
//   });

//   const products = data.map((product) => {
//     const price = product.default_price as Stripe.Price;

//     const checkedPrice = price.unit_amount ? price.unit_amount / 100 : 0;

//     return {
//       id: product.id,
//       name: product.name,
//       imageUrl: product.images[0],
//       price: checkedPrice,
//     };
//   });
//   return {
//     props: { products },
//   };
// };
