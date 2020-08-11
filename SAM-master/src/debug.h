#ifndef DEBUG_H
#define DEBUG_H

typedef unsigned char uint8_t;

void PrintPhonemes(unsigned char *phonemeindex, unsigned char *phonemeLength, unsigned char *stress);
void PrintOutput(
    unsigned char *flag,
    unsigned char *f1,
    unsigned char *f2,
    unsigned char *f3,
    unsigned char *a1,
    unsigned char *a2,
    unsigned char *a3,
    unsigned char *p, int len);

void PrintRule(int offset);

#endif
