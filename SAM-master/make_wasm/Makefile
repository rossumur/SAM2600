OBJS = reciter.o sam.o render.o main.o debug.o

CC = emcc

CFLAGS =  -Wall -Os -s WASM=1 -s TOTAL_MEMORY=256MB
LFLAGS =

sam: $(OBJS)
	$(CC) -o sam_bridge.js $(OBJS) $(LFLAGS) -s "EXPORTED_FUNCTIONS=['_main']"
	./copy_wasm _wasm sam_bridge.wasm ../../js/sam_bridge_wasm.js
	cp sam_bridge.js ../../js/.

%.o: ../src/%.c
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f *.o