---
title: "Inside the Build: Replacing WhatsApp Dispatch With Real-Time Tracking"
description: "How Sammy Dylax Logistics moved off spreadsheets and WhatsApp groups onto a role-based dispatch platform — and what that transition actually required."
date: "2026-03-02"
author: "JG Creative Tech Solution"
category: "Case Study"
---

Sammy Dylax Logistics is a Nairobi-to-Mombasa fleet operation that
scaled the way most good businesses do: gradually, then all at once.
For a while, shared spreadsheets and WhatsApp groups were enough to
coordinate drivers and dispatch. Then the fleet grew past what that
system could hold together, and dispatch errors and delayed status
updates started costing client trust.

This is what actually changed, and why each piece of it mattered.

## The real problem wasn't the spreadsheet

It's tempting to frame this as "spreadsheets are bad, software is
good." That's not quite it. The spreadsheet had worked fine for a
long time. The actual problem was that dispatch coordination and
client communication had become two separate, disconnected processes
— one living in a shared file, the other happening ad hoc over
WhatsApp — and nothing kept them in sync. A driver's status update in
one channel didn't automatically show up in the other. Every gap
between those two channels was a place where a client's shipment
status went stale.

## What we built instead

The platform is a multi-tenant dispatch system on Next.js and
Firebase Firestore, with role-based access split three ways:
dispatchers, drivers, and clients each see a different view of the
same underlying data, rather than three different systems that
happen to describe the same trucks.

Two design decisions did most of the work:

**Real-time location updates flow through Firestore listeners, not
polling.** A driver's position updates in the dispatcher's view the
moment it changes, not on the next refresh. This sounds like a small
technical detail. In practice, it's the difference between a
dispatcher trusting the map and a dispatcher calling the driver to
double-check — which was exactly the manual-verification habit the
old system had trained everyone into.

**Clients got their own portal instead of a phone number to call.**
Every status-check call was, structurally, a client asking a question
the system already had the answer to — it just wasn't visible to
them. Giving clients direct, real-time visibility into their own
shipments didn't just save operations staff time. It changed what
"contacting the client" meant: from routine status updates to actual
exceptions worth a human conversation.

## What changed, measurably

Dispatch time dropped significantly within the first month of
operation. The client-facing portal eliminated the majority of
status-check calls into the operations team — which meant staff time
that used to go to answering "where's my shipment" questions got
freed up for the calls that actually needed a person: exceptions,
delays, problems worth solving rather than status worth reporting.

## The part that doesn't show up in a demo

Role-based access wasn't a feature request — it was the foundation
the rest of the system depended on. A driver should never be able to
see another driver's assigned routes. A client should never be able
to see another client's shipments. Getting that right meant the
access rules had to live at the data layer, checked on every read and
write, not just hidden behind UI that assumed people would only click
what they were supposed to click.

That's the unglamorous part of a build like this — the part that
never appears in a walkthrough, because when it's working correctly,
nothing visibly happens. Nobody sees the shipment they weren't
supposed to see. That's the whole point.
