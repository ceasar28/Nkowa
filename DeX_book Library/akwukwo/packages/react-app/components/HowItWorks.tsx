import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const LandingPageSection: React.FC = () => {
  return (
    <section id="ide">
      <div className="md:bg-remix-ide-desktop bg-remix-ide-mobile bg-no-repeat bg-remix-desktop-background-position">
        <div className="sm:container sm:m-auto pb-20 pt-10 md:py-50 mx-6">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-4xl md:text-5xl mt-9 font-latoBold pb-6">
                Get started!
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pt-10 gap-y-6 md:gap-x-6">
            {/* connect wallet */}
            <Link href="#" rel="noopener">
              <div className="bg-white rounded-lg border-borderColor border py-6 px-4 h-80 hover:border-blue relative group">
                <h4 className="text-xl pb-1 text-blue font-latoBold">
                  Connect To the Blockchain
                </h4>
                <p className="text-sm text-gray font-sfProSemiBold pb-4">
                  Diverse Wallet Support
                </p>
                <p className="text-sm text-gray font-sfProRegular pb-4">
                  Seamlessly integrate your preferred wallet for instant
                  blockchain access. Our broad wallet support ensures secure
                  asset management, transactions, and confident engagement in
                  decentralized apps.
                </p>
                <div className="flex absolute bottom-6 content-center">
                  <ConnectButton
                    showBalance={{ smallScreen: false, largeScreen: false }}
                  />
                </div>
              </div>
            </Link>

            {/* PUblish */}

            <Link href="/publish" rel="noopener">
              <div className="bg-white rounded-lg border-borderColor border py-6 px-4 h-80 hover:border-blue relative group">
                <h4 className="text-xl pb-1 text-blue font-latoBold">
                  Publish Your Work
                </h4>
                <p className="text-sm text-gray font-sfProSemiBold pb-4">
                  And unlock NFT Book Publishing Now!
                </p>
                <p className="text-sm text-gray font-sfProRegular pb-4">
                  We offer a free book nft minting and listing service.
                </p>
                <div className="flex absolute bottom-6 content-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Try it out
                  </button>
                </div>
              </div>
            </Link>

            {/* Explore */}

            <Link href="/explore" rel="noopener">
              <div className="bg-white rounded-lg border-borderColor border py-6 px-4 h-80 hover:border-blue relative group">
                <h4 className="text-xl pb-1 text-blue font-latoBold">
                  Explore
                </h4>
                <p className="text-sm text-gray font-sfProSemiBold pb-4">
                  The Digital World of Books
                </p>
                <p className="text-sm text-gray font-sfProRegular pb-4">
                  Embark on a journey into the digital realm of books and
                  literary creations.
                </p>
                <div className="flex absolute bottom-6 content-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Explore
                  </button>
                </div>
              </div>
            </Link>
            {/* another */}

            <Link href="/profile" rel="noopener">
              <div className="bg-white rounded-lg border-borderColor border py-6 px-4 h-80 hover:border-blue relative group">
                <h4 className="text-xl pb-1 text-blue font-latoBold">
                  Personal Library
                </h4>
                <p className="text-sm text-gray font-sfProSemiBold pb-4">
                  Access to your own collection of books
                </p>
                <p className="text-sm text-gray font-sfProRegular pb-4">
                  Empowering Authors and Readers: Manage NFT Books, Sales,
                  Resales, and Pricing..
                </p>
                <div className="flex absolute bottom-6 content-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    My Books
                  </button>
                </div>
              </div>
            </Link>

            {/* Royalty/}
           

            {/* another */}

            <Link href="#" rel="noopener">
              <div className="bg-white rounded-lg border-borderColor border py-6 px-4 h-80 hover:border-blue relative group">
                <h4 className="text-xl pb-1 text-blue font-latoBold">
                  Royalty and Sales
                </h4>
                <p className="text-sm text-gray font-sfProSemiBold pb-4">
                  Royalty - 10%, sale- 5%
                </p>
                <p className="text-sm text-gray font-sfProRegular pb-4">
                  We want authors to benefit from the see change of NFT, 10% of
                  any future resale of thier work, and also readers to be able
                  to resale thier collections too. We charge a 5% on every
                  single sales transaction on the platform
                </p>
                <div className="flex absolute bottom-6 content-center"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPageSection;
