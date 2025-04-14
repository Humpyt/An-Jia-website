"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form"
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { LanguageSwitcher, useLanguage } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function ContactPage() {
  const { translate } = useLanguage()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement form submission
    console.log(values)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <NavLinks />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AuthButtons />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-rose-50 py-12 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {translate("contact_us")}
              </h1>
              <p className="text-lg text-neutral-600">
                {translate("contact_description")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Phone className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{translate("phone")}</h3>
                      <p className="text-sm text-neutral-600">+256 (0) 701-234567</p>
                      <p className="text-sm text-neutral-600">+256 (0) 772-345678</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Mail className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{translate("email")}</h3>
                      <p className="text-sm text-neutral-600">info@anjiayouxuan.com</p>
                      <p className="text-sm text-neutral-600">support@anjiayouxuan.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <MapPin className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{translate("address")}</h3>
                      <p className="text-sm text-neutral-600">
                        Plot 123, Kampala Road
                        <br />
                        Kampala, Uganda
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <MessageSquare className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{translate("social_media")}</h3>
                      <div className="flex gap-4">
                        <Link href="#" className="text-neutral-600 hover:text-rose-500">
                          WhatsApp
                        </Link>
                        <Link href="#" className="text-neutral-600 hover:text-rose-500">
                          WeChat
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 md:col-span-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate("name")}</FormLabel>
                          <FormControl>
                            <Input placeholder={translate("enter_your_name")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate("email")}</FormLabel>
                          <FormControl>
                            <Input placeholder={translate("enter_your_email")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate("phone")} ({translate("optional")})</FormLabel>
                          <FormControl>
                            <Input placeholder={translate("enter_your_phone")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translate("message")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={translate("enter_your_message")} 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      {translate("send_message")}
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}