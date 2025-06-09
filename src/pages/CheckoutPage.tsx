import React from 'react';
import SiteNavigationMenu from '@/components/layout/SiteNavigationMenu';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Info, CreditCard } from 'lucide-react';

const checkoutSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  shippingAddress: z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    addressLine1: z.string().min(1, "Address is required."),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required."),
    state: z.string().min(1, "State/Province is required."),
    zipCode: z.string().min(5, "Zip/Postal code is required.").max(10),
    country: z.string().min(1, "Country is required."),
    phone: z.string().optional(),
  }),
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional().refine(val => !val || val.length >= 5, { message: "Zip/Postal code must be at least 5 characters." }),
    country: z.string().optional(),
  }).optional(),
  shippingMethod: z.string().min(1, "Shipping method is required."),
  paymentMethod: z.string().min(1, "Payment method is required.").default("creditCard"),
  creditCard: z.object({
    cardNumber: z.string().min(13, "Invalid card number").max(19, "Invalid card number").refine(val => /^\d+$/.test(val), "Card number must be digits"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)."),
    cvv: z.string().min(3, "Invalid CVV").max(4, "Invalid CVV").refine(val => /^\d+$/.test(val), "CVV must be digits"),
    cardHolderName: z.string().min(1, "Card holder name is required."),
  }).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms." })
}).superRefine((data, ctx) => {
  if (!data.billingSameAsShipping && data.billingAddress) {
    if (!data.billingAddress.firstName) ctx.addIssue({ path: ['billingAddress.firstName'], message: 'First name is required for billing address.', code: z.ZodIssueCode.custom });
    if (!data.billingAddress.addressLine1) ctx.addIssue({ path: ['billingAddress.addressLine1'], message: 'Address is required for billing address.', code: z.ZodIssueCode.custom });
    // Add other required checks for billing address
  }
  if (data.paymentMethod === 'creditCard' && !data.creditCard) {
     ctx.addIssue({ path: ['creditCard.cardNumber'], message: 'Card details are required.', code: z.ZodIssueCode.custom });
  }
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Mock order summary
const orderSummaryItems = [
    { id: 'sum1', name: 'Premium Headphones', quantity: 1, price: 199.99},
    { id: 'sum2', name: 'Smart Tracker', quantity: 2, price: 89.50},
];
const subtotal = orderSummaryItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shipping = 5.00;
const tax = subtotal * 0.08;
const total = subtotal + shipping + tax;


const CheckoutPage: React.FC = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();
  const { control, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: { country: "US" },
      billingSameAsShipping: true,
      shippingMethod: "standard",
      paymentMethod: "creditCard",
      agreeToTerms: false,
    },
  });

  const billingSameAsShipping = watch("billingSameAsShipping");
  const paymentMethod = watch("paymentMethod");

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Checkout form submitted:', data);
    // Process payment, create order, etc.
    // For now, navigate to a success page (mock)
    navigate('/order-confirmation'); 
  };

  const renderError = (fieldName: keyof CheckoutFormData | `shippingAddress.${keyof CheckoutFormData['shippingAddress']}` | `billingAddress.${keyof NonNullable<CheckoutFormData['billingAddress']>}` | `creditCard.${keyof NonNullable<CheckoutFormData['creditCard']>}`) => {
    const fieldPath = fieldName.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error = errors as any;
    for (const part of fieldPath) {
        if (!error) break;
        error = error[part];
    }
    return error ? <p className="text-sm text-destructive mt-1">{error.message}</p> : null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <SiteNavigationMenu siteTitle="EcomStore" />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Checkout</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          {/* Left/Main Column: Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" {...field} />
                            {renderError("email")}
                        </div>
                    )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <Controller name="shippingAddress.firstName" control={control} render={({ field }) => (<div><Label htmlFor="s-firstName">First Name</Label><Input id="s-firstName" {...field} />{renderError("shippingAddress.firstName")}</div>)} />
                    <Controller name="shippingAddress.lastName" control={control} render={({ field }) => (<div><Label htmlFor="s-lastName">Last Name</Label><Input id="s-lastName" {...field} />{renderError("shippingAddress.lastName")}</div>)} />
                </div>
                <Controller name="shippingAddress.addressLine1" control={control} render={({ field }) => (<div><Label htmlFor="s-address1">Address Line 1</Label><Input id="s-address1" {...field} />{renderError("shippingAddress.addressLine1")}</div>)} />
                <Controller name="shippingAddress.addressLine2" control={control} render={({ field }) => (<div><Label htmlFor="s-address2">Address Line 2 (Optional)</Label><Input id="s-address2" {...field} /></div>)} />
                <div className="grid sm:grid-cols-3 gap-4">
                    <Controller name="shippingAddress.city" control={control} render={({ field }) => (<div><Label htmlFor="s-city">City</Label><Input id="s-city" {...field} />{renderError("shippingAddress.city")}</div>)} />
                    <Controller name="shippingAddress.state" control={control} render={({ field }) => (<div><Label htmlFor="s-state">State/Province</Label><Input id="s-state" {...field} />{renderError("shippingAddress.state")}</div>)} />
                    <Controller name="shippingAddress.zipCode" control={control} render={({ field }) => (<div><Label htmlFor="s-zip">Zip/Postal Code</Label><Input id="s-zip" {...field} />{renderError("shippingAddress.zipCode")}</div>)} />
                </div>
                <Controller name="shippingAddress.country" control={control} render={({ field }) => (
                    <div><Label htmlFor="s-country">Country</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="s-country"><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent><SelectItem value="US">United States</SelectItem><SelectItem value="CA">Canada</SelectItem><SelectItem value="GB">United Kingdom</SelectItem></SelectContent>
                    </Select>
                    {renderError("shippingAddress.country")}</div>
                )} />
                 <Controller name="shippingAddress.phone" control={control} render={({ field }) => (<div><Label htmlFor="s-phone">Phone (Optional)</Label><Input id="s-phone" type="tel" {...field} placeholder="For delivery updates" /></div>)} />
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Billing Address</CardTitle></CardHeader>
                <CardContent>
                    <Controller name="billingSameAsShipping" control={control} render={({ field }) => (
                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox id="billingSame" checked={field.value} onCheckedChange={field.onChange} />
                            <Label htmlFor="billingSame">Same as shipping address</Label>
                        </div>
                    )} />
                    {!billingSameAsShipping && (
                        <div className="space-y-4 p-4 border rounded-md bg-muted/50">
                            <p className="text-sm text-muted-foreground">Enter billing address details:</p>
                             <div className="grid sm:grid-cols-2 gap-4">
                                <Controller name="billingAddress.firstName" control={control} render={({ field }) => (<div><Label htmlFor="b-firstName">First Name</Label><Input id="b-firstName" {...field} />{renderError("billingAddress.firstName")}</div>)} />
                                <Controller name="billingAddress.lastName" control={control} render={({ field }) => (<div><Label htmlFor="b-lastName">Last Name</Label><Input id="b-lastName" {...field} />{renderError("billingAddress.lastName")}</div>)} />
                            </div>
                            <Controller name="billingAddress.addressLine1" control={control} render={({ field }) => (<div><Label htmlFor="b-address1">Address Line 1</Label><Input id="b-address1" {...field} />{renderError("billingAddress.addressLine1")}</div>)} />
                            {/* ... other billing address fields ... */}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Shipping Method</CardTitle></CardHeader>
              <CardContent>
                <Controller
                    name="shippingMethod"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                            <Label className="flex items-center space-x-3 p-3 border rounded-md hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                                <RadioGroupItem value="standard" id="ship-standard" /> 
                                <span>Standard Shipping (5-7 days) - $5.00</span>
                            </Label>
                            <Label className="flex items-center space-x-3 p-3 border rounded-md hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                                <RadioGroupItem value="express" id="ship-express" />
                                <span>Express Shipping (2-3 days) - $15.00</span>
                            </Label>
                        </RadioGroup>
                    )}
                />
                {renderError("shippingMethod")}
              </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                <CardContent>
                    <Controller name="paymentMethod" control={control} render={({ field }) => (
                        <Accordion type="single" collapsible className="w-full" value={field.value} onValueChange={field.onChange}>
                            <AccordionItem value="creditCard">
                                <AccordionTrigger className="font-medium"><CreditCard className="mr-2 h-5 w-5 inline"/>Credit Card</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Test Mode</AlertTitle>
                                        <AlertDescription>Use a test card number like 4242... for this demo.</AlertDescription>
                                    </Alert>
                                    <Controller name="creditCard.cardHolderName" control={control} render={({ field: f }) => (<div><Label htmlFor="cc-name">Cardholder Name</Label><Input id="cc-name" {...f} />{renderError("creditCard.cardHolderName")}</div>)} />
                                    <Controller name="creditCard.cardNumber" control={control} render={({ field: f }) => (<div><Label htmlFor="cc-number">Card Number</Label><Input id="cc-number" type="text" placeholder="•••• •••• •••• ••••" {...f} />{renderError("creditCard.cardNumber")}</div>)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller name="creditCard.expiryDate" control={control} render={({ field: f }) => (<div><Label htmlFor="cc-expiry">Expiry Date (MM/YY)</Label><Input id="cc-expiry" placeholder="MM/YY" {...f} />{renderError("creditCard.expiryDate")}</div>)} />
                                        <Controller name="creditCard.cvv" control={control} render={({ field: f }) => (<div><Label htmlFor="cc-cvv">CVV</Label><Input id="cc-cvv" placeholder="•••" {...f} />{renderError("creditCard.cvv")}</div>)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="paypal">
                                <AccordionTrigger className="font-medium">PayPal</AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <p className="text-muted-foreground">You will be redirected to PayPal to complete your payment.</p>
                                    <Button variant="outline" className="mt-2 w-full" type="button" onClick={() => alert("Redirecting to PayPal (mock)")}>Pay with PayPal</Button>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )} />
                     {renderError("paymentMethod")}
                </CardContent>
            </Card>
            
            <div className="space-y-2">
                 <Controller name="agreeToTerms" control={control} render={({ field }) => (
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
                        <Label htmlFor="terms" className="text-sm">
                            I agree to the <Link to="/terms" className="underline hover:text-primary">Terms and Conditions</Link>.
                        </Label>
                    </div>
                )} />
                {renderError("agreeToTerms")}
            </div>

            <Button type="submit" size="lg" className="w-full">Place Order</Button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20"> {/* Sticky summary */}
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {orderSummaryItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{item.name} (x{item.quantity})</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <hr/>
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Taxes</span><span>${tax.toFixed(2)}</span></div>
                <hr/>
                <div className="flex justify-between font-semibold text-lg text-foreground"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;