import { BookRecommendation } from "@/components/book-recommendation"


export default function BrowsePage() {

     return (
          <div className="container relative px-5 my-20 flex-1 flex flex-col">
               <div className="flex justify-center"></div>
               <BookRecommendation />
          </div>
     )
}