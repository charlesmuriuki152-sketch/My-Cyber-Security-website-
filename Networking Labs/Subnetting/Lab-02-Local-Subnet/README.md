🔬 LAB 2 — Understand Your Local Subnet

Objective

The objective of this lab was to identify my local IPv4 subnet and determine its:

- Network address
- Broadcast address
- First usable address
- Last usable address
- Number of usable hosts

This lab applies IPv4 subnetting concepts to a real Kali Linux networking environment.

---

1. Identify the IPv4 Address

I used the following command:

ip -4 addr

The relevant network interface was:

eth0

The IPv4 address discovered was:

172.18.38.94/20

Therefore:

Interface:        eth0
IPv4 address:     172.18.38.94
CIDR prefix:      /20

---

2. Identify the Default Gateway

I used:

ip route

The routing table showed:

default via 172.18.32.1 dev eth0

Therefore:

Default gateway: 172.18.32.1

The connected network was:

172.18.32.0/20

---

3. Calculate the Subnet

My IPv4 address was:

172.18.38.94/20

A "/20" prefix means:

Network bits: 20
Host bits:    12

IPv4 has 32 bits, therefore:

32 - 20 = 12 host bits

The total number of addresses is:

2^12 = 4096

Two addresses are reserved for the network and broadcast addresses:

4096 - 2 = 4094 usable hosts

---

4. Subnet Results

Property| Result
Interface| "eth0"
IPv4 address| "172.18.38.94"
CIDR prefix| "/20"
Network address| "172.18.32.0"
First usable address| "172.18.32.1"
Last usable address| "172.18.47.254"
Broadcast address| "172.18.47.255"
Number of usable hosts| "4094"
Default gateway| "172.18.32.1"

---

5. Evidence

The following screenshot contains the Linux commands and network information used during this lab:

ip -4 addr
ip route

"Network information" (lab-02-network-information.png)

---

6. Cybersecurity Connection

This lab demonstrates how a cybersecurity engineer can identify the network to which a system belongs.

Knowing the subnet is useful when:

- Analyzing network traffic
- Investigating suspicious hosts
- Writing firewall rules
- Configuring access-control lists
- Performing network reconnaissance
- Identifying network boundaries
- Investigating security incidents
- Designing network segmentation

My system belongs to:

172.18.32.0/20

The subnet range is:

172.18.32.0 - 172.18.47.255

Understanding this range helps provide context when analyzing network activity.

---

7. Commands Used

ip -4 addr
ip route

---

8. Skills Practiced

- IPv4 addressing
- CIDR notation
- Subnet identification
- Network address calculation
- Broadcast address calculation
- Host-range calculation
- Linux network inspection
- Basic network analysis
- Cybersecurity network awareness

---

Conclusion

I successfully identified the IPv4 configuration of my Kali Linux environment and calculated the boundaries of its "/20" subnet.

The final results were:

Network:       172.18.32.0/20
First usable:  172.18.32.1
Last usable:   172.18.47.254
Broadcast:     172.18.47.255
Usable hosts:  4094

This lab demonstrated how theoretical subnetting concepts can be applied directly to a real Linux networking environment.
