const Header = () => {
    return (
        <div className="fixed t-0 flex justify-start items-center border-b-[3px] border-[#484e53] w-full h-16 m-auto pl-[0.75rem] pr-[0.75rem]  ">
            <div className="flex flex-row items-center m-auto w-full max-w-[1320px]">
                <div className="flex items-center justify-center w-1/3 gap-8">
                    <div className="flex flex-row items-center gap-2">
                        <img src="/wasabi-logo.svg" style={{ width: '50px', height: '40px' }} alt="" />
                        <div className="flex flex-col items-center">
                            <span className="font-extrabold text-base text-[#f8f9fa]">
                                MoChain
                            </span>
                            <span className="font-extrabold text-base text-[#f8f9fa]">
                                Charts
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        {/* <img src="/token.png" alt="" className='w-7 h-7' /> */}
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-green-400">
                                {'$0.2'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-1/3">

                </div>
                {/* <div className="flex justify-end w-1/3">
                    <Button variant='contained'>Connect</Button>
                </div> */}
            </div>
        </div>
    )
}

export default Header
