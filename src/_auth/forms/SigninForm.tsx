import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { SignInValidationSchema } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext"


const SigninForm = () => {

    const { toast } = useToast();
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

    const { mutateAsync: signInAccount } = useSignInAccount();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignInValidationSchema>>({
        resolver: zodResolver(SignInValidationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignInValidationSchema>) {
        const session = await signInAccount({
            email: values.email,
            password: values.password,
        });

        if (!session) {
            return toast({
                title: "Sign in failed, Please try again."
            })
        }

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset();
            navigate('/');
        } else {
            toast({title: 'Sign up failed. Please try again'})
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Login to your account</h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back, please enter your details</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" placeholder="shadcn" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" placeholder="shadcn" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {
                            isUserLoading ? (
                                <div className="flex-center gap-2"><Loader /> Loading...</div>
                            ) : "Log in"
                        }
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Don't have an account?&nbsp;
                        <Link to="/sign-up" className="text-primary-500 text-small-semibold mt-1">Sign up</Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SigninForm