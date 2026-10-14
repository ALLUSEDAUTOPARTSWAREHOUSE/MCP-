import { db } from '@/lib/db'
import { orders, payments, orderItems, notificationLogs } from '@/lib/db/schema'
import { dispatchNotification } from '@/lib/notification-dispatcher'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { orderNumber, formData, cartItems, totalAmount } = await request.json()

    // Create order in database
    const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    await db.insert(orders).values({
      id: orderId,
      userId: 'guest',
      orderNumber,
      status: 'pending',
      totalAmount: totalAmount.toString(),
      subtotal: cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toString(),
      shippingAddress: JSON.stringify({
        address: formData.sameAsBilling ? formData.billingAddress : formData.shippingAddress,
        city: formData.sameAsBilling ? formData.billingCity : formData.shippingCity,
        state: formData.sameAsBilling ? formData.billingState : formData.shippingState,
        zip: formData.sameAsBilling ? formData.billingZip : formData.shippingZip,
      }),
      billingAddress: JSON.stringify({
        address: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        zip: formData.billingZip,
      }),
      items: cartItems,
    })

    // Create payment record with mock authorization
    const authCode = `AUTH-${Date.now().toString().slice(-6)}`
    const cardLast4 = formData.cardNumber.slice(-4)
    
    await db.insert(payments).values({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      userId: 'guest',
      amount: totalAmount.toString(),
      status: 'authorized',
      paymentMethod: formData.paymentMethod,
      cardDetails: formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card' 
        ? JSON.stringify({ last4: cardLast4, expiry: formData.expiryDate })
        : null,
      authorizationCode: authCode,
    })

    // Add order items
    for (const item of cartItems) {
      await db.insert(orderItems).values({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price.toString(),
        totalPrice: (item.price * item.quantity).toString(),
        partNumber: item.partNumber || '',
      })
    }

    // Prepare email data
    const emailData = {
      orderNumber,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      phone: formData.phone,
      billingAddress: `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`,
      shippingAddress: formData.sameAsBilling 
        ? `${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`
        : `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingState} ${formData.shippingZip}`,
      vehicle: `${formData.year} ${formData.make} ${formData.model} (VIN: ${formData.vin})`,
      totalAmount,
      items: cartItems,
      authorizationCode: authCode,
      paymentMethod: formData.paymentMethod,
      cardLast4: formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card' ? cardLast4 : '',
    }

    // Trigger newOrder notification to admin emails
    await dispatchNotification({
      eventType: 'newOrder',
      referenceId: orderId,
      referenceType: 'order',
      data: emailData,
    })

    // Log notification
    await db.insert(notificationLogs).values({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventType: 'newOrder',
      recipients: JSON.stringify(['auapworld@gmail.com', 'sale@auapw.com', formData.email]),
      subject: `New Order ${orderNumber}`,
      status: 'pending',
      referenceId: orderId,
      referenceType: 'order',
      metadata: emailData,
    })

    return Response.json({
      success: true,
      orderId,
      orderNumber,
      message: 'Order created successfully',
    })
  } catch (error) {
    console.error('[v0] Order creation error:', error)
    return Response.json(
      { error: 'Failed to create order', message: error instanceof Error ? error.message : '' },
      { status: 500 }
    )
  }
}
