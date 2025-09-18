// import { FaHome } from "react-icons/fa";

// export default function StmHome() {
//   return (
//     <div
//       className="relative min-h-screen w-full mt-[-64px] flex flex-col bg-black bg-cover bg-center"
//       style={{
//         backgroundImage: "url('/images/stmhome.jpg')",
//       }}
//     >
      
//       {/* Main Content */}
//       <div className="relative flex-1 mt-[-190px] flex flex-col items-center justify-center text-center space-y-4 py-8">
//         <FaHome className="h-12 w-12 sm:h-16 sm:w-16 text-white animate-bounce" />
//         <h1 className="text-3xl  font-semibold text-slate-800 drop-shadow-lg">
//           Welcome to STM Homre
//         </h1>
//         <p className="text-sm font-semibold md:text-lg  text-gray-800 max-w-md">
//           Specialised Towel Manufacturers Limited
//         </p>
//       </div>

//       {/* Footer */}
//       <footer className="relative text-center text-xs  text-gray-300 py-6 bg-black/60">
//         © 2025 STM. All rights reserved.
//       </footer>
//     </div>
//   );
// }


import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

export default function StmHome() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 mt-[-100px]">
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center space-y-3 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <FaHome className="h-14 w-14 sm:h-16 sm:w-16 text-blue-600 animate-bounce" />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-3xl font-bold tracking-tight "
        >
          Welcome to <span className="text-blu-600">STM Home</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="text-base  text-gray-600 max-w-xl"
        >
          Specialised Towel Manufacturers Limited
        </motion.p>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        © 2025 STM. All rights reserved.
      </footer>
    </div>
  );
}


