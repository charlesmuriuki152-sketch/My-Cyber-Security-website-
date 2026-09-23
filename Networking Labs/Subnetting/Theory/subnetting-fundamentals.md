Subnetting Fundamentals

Overview

Subnetting is the process of dividing an IP network into smaller logical networks called subnets.

It is an important networking concept and a foundational cybersecurity skill because cybersecurity engineers need to understand how systems are organized and communicate across networks.

---

1. What Is Subnetting?

Subnetting divides a larger IP network into smaller networks.

For example:

192.168.10.0/24

can be divided into smaller subnets.

Each subnet has its own:

- Network address
- Usable host range
- Broadcast address
- Number of available host addresses

---

2. CIDR Prefix

CIDR stands for Classless Inter-Domain Routing.

The number after the "/" indicates how many bits of the IPv4 address are used for the network portion.

For example:

192.168.10.0/24

means:

Network bits: 24
Host bits:     8

IPv4 addresses contain 32 bits.

Therefore:

32 - 24 = 8 host bits

The number of addresses is:

2^8 = 256 addresses

For a normal IPv4 subnet, two addresses are reserved:

- Network address
- Broadcast address

Therefore:

256 - 2 = 254 usable host addresses

---

3. Important Subnetting Terms

Network Address

The network address identifies the subnet itself.

Example:

192.168.10.0/24

The network address is:

192.168.10.0

Broadcast Address

The broadcast address is used to communicate with all hosts on the subnet.

For:

192.168.10.0/24

the broadcast address is:

192.168.10.255

First Usable Address

The first address after the network address.

192.168.10.1

Last Usable Address

The address immediately before the broadcast address.

192.168.10.254

Usable Hosts

For a normal IPv4 subnet:

Usable hosts = Total addresses - 2

---

4. Why Subnetting Matters in Cybersecurity

Subnetting is not just an academic networking exercise.

Cybersecurity engineers use subnetting when designing and analyzing networks.

A network can be separated into different security zones:

Internet
   |
Firewall
   |
   +---- Web Server Network
   |
   +---- Application Network
   |
   +---- Database Network
   |
   +---- Management Network

Separating systems into different networks can help security controls be applied between those networks.

Subnetting is therefore related to:

- Network segmentation
- Access control
- Firewall rules
- Attack-surface reduction
- Incident containment
- Security architecture

---

5. Security Scenario

Imagine an organization has:

192.168.10.0/24

and contains:

Web servers
Employee computers
Database servers
Security monitoring systems

Instead of placing everything into one large network, a security engineer could create separate network segments.

For example:

192.168.10.0/26      Web Servers
192.168.10.64/26     Employee Computers
192.168.10.128/26    Database Servers
192.168.10.192/26    Security Monitoring

Traffic between these networks can then be controlled using security mechanisms such as firewalls and access-control lists.

For example:

Employee Network
       |
       | HTTPS
       v
Web Server Network
       |
       | Database traffic
       v
Database Network

The database network does not necessarily need to accept connections directly from every employee computer.

---

6. Cybersecurity Connection

Subnetting helps a cybersecurity engineer understand:

- Where systems are located on a network
- Which systems belong to the same network
- Where network boundaries exist
- How firewall rules can be designed
- How access-control rules can be applied
- How network traffic can be analyzed
- How compromised systems can potentially be isolated

Subnetting provides an important foundation for:

- Network security
- SOC operations
- Incident response
- Penetration testing
- Vulnerability assessment
- Cloud security
- Security engineering

---

7. Practical Application

In this lab, I applied subnetting concepts to a real Kali Linux networking environment.

The IPv4 configuration identified was:

IPv4 address: 172.18.38.94/20

The subnet was:

172.18.32.0/20

This demonstrates how theoretical subnetting knowledge can be applied to identify the network boundaries of an actual system.

---

Key Takeaway

«Subnetting helps cybersecurity engineers understand and create network boundaries that can be used to enforce security controls.»
