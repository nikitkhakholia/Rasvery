import React from "react";

const logo = require("../assets/logo.png");
export default function Header() {
  return (
    <div className="bg-black text-white">
      <div className=" flex ">
        <div className="basis-full md:basis-1/3">11</div>
        <div className="basis-full md:basis-2/3">22</div>
      </div>
      {/* <div class="flex flex-row">
        <div class="basis-1/4 md:basis-auto">01</div>
        <div class="basis-1/4 md:basis-auto">02</div>
        <div class="basis-1/2 md:basis-auto">03</div>
      </div> */}
    </div>
    //       {/* <img className="w-24" src={logo} alt="" />
    //   <h1 className=" text-5xl">Rasvery </h1> */}
    //      {/* <div className="flex flex-reverse">
    //     <div class="">
    //       <input type="text" placeholder="Search Anything" />
    //     </div>
    //     <div class=" bg-blue-900">Cart</div>
    //     <div class=" bg-green-900 ">Menu</div>
    //   </div> */}
  );
}
