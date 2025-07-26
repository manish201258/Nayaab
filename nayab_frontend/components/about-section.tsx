// "use client"

// import { Button } from "@/components/ui/button"

// export default function AboutSection() {
//   return (
//     <section className="py-20 bg-gradient-to-b from-white to-gray-100">
//       <div className="container mx-auto px-6 md:px-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Image */}
//           <div className="relative overflow-hidden rounded-2xl shadow-lg group">
//             <img
//               src="/about.webp"
//               alt="Antique Shop Interior"
//               className="w-full h-[32rem] object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
//             />
//             <div className="absolute bottom-6 left-6 bg-black bg-opacity-50 px-4 py-2 rounded-lg transition-opacity duration-300 group-hover:bg-opacity-70">
//               <p className="text-white font-script text-2xl tracking-wide">Nayaab Shop</p>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="space-y-8">
//             <p className="text-indigo-600 text-sm font-medium tracking-widest uppercase">About Us</p>
//             <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
//               Nayaab Co.
//             </h2>
//             <h3 className="text-2xl text-gray-500 font-medium">Curators of Timeless Antiques</h3>

//             <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
//               Discover a world of elegance and history with Nayaab Co. Our passion for antiques drives us to curate pieces that tell stories, blending tradition with timeless beauty.
//             </p>

//             <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
//               Each item in our collection is carefully selected to inspire and elevate your spaces, connecting the past with the present.
//             </p>

//             <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300">
//               Explore Now
//             </Button>

//             {/* Timeline */}
//             <div className="mt-12 space-y-6">
//               <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-2 before:bg-indigo-600 before:rounded-full before:mt-2">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-1">Since 2001</h4>
//                 <p className="text-gray-600 text-sm leading-relaxed">
//                   Founded with a vision to preserve the beauty of antiques, Nayaab Co. began its journey to bring timeless treasures to collectors worldwide.
//                 </p>
//                 <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">
//                   See More
//                 </a>
//               </div>

//               <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:w-2 before:h-2 before:bg-indigo-600 before:rounded-full before:mt-2">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-1">In 2024</h4>
//                 <p className="text-gray-600 text-sm leading-relaxed">
//                   Expanded our collection to include rare artifacts, establishing Nayaab Co. as a trusted name in antique curation.
//                 </p>
//                 <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">
//                   See More
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }