import React from 'react';

export const Upsell = () => {
  return (
    <div className="text-white grid md:grid-cols-2 gap-4 px-2 mt-4 max-w-[700px] mx-auto">
      <div className="bg-[#182220] rounded-xl p-4 relative h-[160px] flex flex-col gap-y-2 ">
        <div className="text-xl font-semibold">Swap fees</div>
        <div className="text-white/60 text-sm">Earn swap fees easily.</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/swap_fee.svg" alt="swap-fees" className="absolute top-0 right-0" />
      </div>

      <div className="bg-[#151E31] rounded-xl p-4 relative gap-y-2 flex flex-col min-h-[160px] h-auto pb-6">
        <div className="text-xl font-semibold w-[80%]">
          MERHelpDesk 24/7 customer service support
        </div>
        <div className="text-white/60 w-[80%] text-sm leading-relaxed">
          If you encounter any issues, please click the Twitter (X) icon at the bottom of the page and send us your questions. Our support team is available 24/7 and will do our best to resolve any problems you may have.
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/customizable_options.svg" alt="customizable-options" className="absolute top-0 right-0" />
      </div>

      <div className="bg-[#002F25] rounded-xl p-4 relative h-[160px] flex flex-col gap-y-2">
        <div className="text-xl font-semibold w-[80%]">Ultra Swap</div>
        <div className="text-white/60 w-[80%] text-sm">
          Seamlessly integrate end to end jup.ag swap experience with all Ultra features
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/seemless_integration.svg" alt="ultra-swap" className="absolute top-0 right-0" />
      </div>

      <div className="bg-[#231B32] rounded-xl p-4 relative gap-y-2 flex flex-col min-h-[160px] h-auto pb-6">
        <div className="text-xl font-semibold w-[80%]">
          One-stop service! MERDEX provides you with a global aggregator!
        </div>
        <div className="text-white/60 w-[80%] text-sm leading-relaxed">
          MERDEX has aggregated the whole network quotation for you! And try our best to bring you more market opportunities!
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/upsell/rpc_less.svg" alt="rpc-less" className="absolute top-0 right-0" />
      </div>
    </div>
  );
};
