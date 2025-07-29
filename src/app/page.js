import Carousel from "@/components/Carousel/Carousel";
import Navbar from "@/components/Navbar/Navbar";
import CategoriesCarousel from "@/components/CategoriesCarousel/CategoriesCarousel";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Carousel slides={[
        { image: "", title: "صورة 1" },
        { image: "", title: "صورة 2" },
        { image: "", title: "صورة 3" }
      ]}/>
      <CategoriesCarousel/>
    </div>
  );
}
