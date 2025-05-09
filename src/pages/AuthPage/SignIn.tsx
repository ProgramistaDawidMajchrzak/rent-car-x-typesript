import React from 'react';
import { Image } from '../../components/Image';
export const SignInPage: React.FC = () => {
    return (
        <>
                    <div className="flex h-screen min-w-[screen]">
                        <div className="flex flex-col justify-center p-10 w-1/2 max-md:w-full">
                        <div className="mx-auto w-full max-w-[320px]">
                            
                            <div className="mb-4 text-2xl font-bold">Sign In</div>
                            <div className="flex flex-col gap-4 mb-6">
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-bold">Email</div>
                                <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                                />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-bold">Password</div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-bold">Confirm Password</div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="px-2 w-full text-xs rounded-lg border border-slate-900 border-opacity-50 h-[30px] text-zinc-400"
                                    />
                                </div>
                                
                                <div className="mt-1.5 text-xs font-bold cursor-pointer">
                                I forgot my password
                                </div>
                            </div>
                            </div>
                            <div className="flex gap-4">
                                <a href="/login">
                                    <div className="flex items-center justify-center px-4 text-xs font-bold rounded border cursor-pointer border-slate-900 h-[30px] w-[160px] text-slate-900">
                                        Log In
                                    </div>
                                </a>
        
                            {/* <Button value="SignIn"/> */}
                            <div className="flex justify-center items-center px-4 rounded cursor-pointer bg-slate-900 w-[160px] h-[30px]">
                                <span className="text-xs font-bold text-white">Sign In</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="flex justify-center items-center bg-[linear-gradient(155deg,#02193D_-0.86%,#02193D_98.91%)] w-1/2 max-md:hidden">
                            <div className="flex flex-col items-center">
                                <Image name="LogoAuth" className="w-[320px]" alt="Logo" />
                            </div>
                        </div>
                    </div>
                </>
    );
};
